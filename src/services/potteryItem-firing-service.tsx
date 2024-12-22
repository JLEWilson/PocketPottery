import { SQLiteDatabase } from "expo-sqlite";
import { PotteryItemFirings } from "../models";

export const POTTERY_ITEM_FIRINGS_TABLE = "PotteryItemFirings";

export const createPotteryItemFiringsTable = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_FIRINGS_TABLE} (
      firingId TEXT PRIMARY KEY,
      potteryItemId TEXT NOT NULL,
      fireStyle TEXT NOT NULL,
      fireType TEXT NOT NULL,
      cone TEXT NOT NULL,
      FOREIGN KEY (potteryItemId) REFERENCES PotteryItems (potteryItemId) ON DELETE CASCADE
    );
  `;
  await db.execAsync(createTableQuery);
};

export const addFiring = async (
  db: SQLiteDatabase,
  firing: PotteryItemFirings
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_FIRINGS_TABLE} (firingId, potteryItemId, fireStyle, fireType, cone)
    VALUES ('${firing.firingId}', '${firing.potteryItemId}', '${firing.fireStyle}', '${firing.fireType}', '${firing.cone}');
  `;
  await db.execAsync(query);
};

export const getFiringsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string
): Promise<PotteryItemFirings[] | null> => {
  const query = `
    SELECT *
    FROM ${POTTERY_ITEM_FIRINGS_TABLE}
    WHERE potteryItemId = '${potteryItemId}';
  `;
  const result = await db.getAllAsync(query);
  return result ? (result as PotteryItemFirings[]) : null; // Returns all firings for the specified pottery item
};

export const deleteFiring = async (
  db: SQLiteDatabase,
  firingId: string
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_FIRINGS_TABLE}
    WHERE firingId = '${firingId}';
  `;
  await db.execAsync(query);
};

export const deleteFiringsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_FIRINGS_TABLE}
    WHERE potteryItemId = '${potteryItemId}';
  `;
  await db.execAsync(query);
};

// Add console logs to confirm execution
console.log('PotteryItemFirings functions are defined.');
