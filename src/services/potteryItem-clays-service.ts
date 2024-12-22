import { SQLiteDatabase } from "expo-sqlite";
import { Clay, PotteryItem, PotteryItemClays } from "../models";

export const POTTERY_ITEM_CLAYS_TABLE = "PotteryItemClays";

export const createPotteryItemClaysTable = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_CLAYS_TABLE} (
      potteryItemId TEXT NOT NULL,
      clayId TEXT NOT NULL,
      PRIMARY KEY (potteryItemId, clayId),
      FOREIGN KEY (potteryItemId) REFERENCES PotteryItems (potteryItemId) ON DELETE CASCADE,
      FOREIGN KEY (clayId) REFERENCES Clays (clayId) ON DELETE CASCADE
    );
  `;
  await db.execAsync(createTableQuery);
  console.log('potteryItem Clays Join created')
};

export const addPotteryItemClayLink = async (
  db: SQLiteDatabase,
  potteryItemId: string,
  clayId: string
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_CLAYS_TABLE} (potteryItemId, clayId)
    VALUES (${potteryItemId}, ${clayId}]);
  `;
  await db.execAsync(query);
};

export const removePotteryItemClayLink = async (
  db: SQLiteDatabase,
  potteryItemId: string,
  clayId: string
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_CLAYS_TABLE}
    WHERE potteryItemId = ${potteryItemId} AND clayId = ${clayId};
  `;
  await db.execAsync(query);
};

export const getClaysByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string
): Promise<Clay[] | null> => {
  const query = `
    SELECT c.*
    FROM Clays c
    INNER JOIN ${POTTERY_ITEM_CLAYS_TABLE} pc ON c.clayId = pc.clayId
    WHERE pc.potteryItemId = ${potteryItemId};
  `;
  const result = await db.getAllAsync(query);
  return result ? (result as Clay[]) : null;
};

export const getPotteryItemsByClayId = async (
  db: SQLiteDatabase,
  clayId: string
): Promise<PotteryItem[] | null> => {
  const query = `
    SELECT p.*
    FROM PotteryItems p
    INNER JOIN ${POTTERY_ITEM_CLAYS_TABLE} pc ON p.potteryItemId = pc.potteryItemId
    WHERE pc.clayId = ${clayId};
  `;
  const result = await db.getAllAsync(query);
  return result ? (result as PotteryItem[]) : null;
};

export const getAllPotteryItemClayLinks = async (
  db: SQLiteDatabase
): Promise<PotteryItemClays[] | null> => {
  const query = `
    SELECT * FROM ${POTTERY_ITEM_CLAYS_TABLE};
  `;
  const result = await db.getAllAsync(query);
  return result ? (result as PotteryItemClays[]) : null // Returns all links between PotteryItems and Clays
};
