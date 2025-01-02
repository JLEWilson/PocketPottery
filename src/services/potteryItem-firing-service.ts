import { SQLiteDatabase } from 'expo-sqlite'
import { PotteryItemFirings } from '../models'

export const POTTERY_ITEM_FIRINGS_TABLE_NAME = 'PotteryItemFirings'

export const createPotteryItemFiringsTable = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_FIRINGS_TABLE_NAME} (
      firingId TEXT PRIMARY KEY,
      potteryItemId TEXT NOT NULL,
      fireStyle TEXT NOT NULL,
      fireType TEXT NOT NULL,
      cone TEXT NOT NULL,
      FOREIGN KEY (potteryItemId) REFERENCES PotteryItems (potteryItemId) ON DELETE CASCADE
    );
  `
  await db.execAsync(createTableQuery)
}

export const addPotteryItemFiring = async (
  db: SQLiteDatabase,
  firing: PotteryItemFirings,
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_FIRINGS_TABLE_NAME} (firingId, potteryItemId, fireStyle, fireType, cone)
    VALUES (?, ?, ?, ?, ?);
  `
  await db.runAsync(query, [firing.firingId, firing.potteryItemId, firing.fireStyle, firing.fireType, firing.cone])
}

export const getFiringsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<PotteryItemFirings[] | null> => {
  const query = `
    SELECT *
    FROM ${POTTERY_ITEM_FIRINGS_TABLE_NAME}
    WHERE potteryItemId = ?;
  `
  const result = await db.getAllAsync(query, [potteryItemId])
  return result ? (result as PotteryItemFirings[]) : null // Returns all firings for the specified pottery item
}

export const deleteFiring = async (db: SQLiteDatabase, firingId: string): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_FIRINGS_TABLE_NAME}
    WHERE firingId = ?;
  `
  await db.runAsync(query, [firingId])
}

export const deleteFiringsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_FIRINGS_TABLE_NAME}
    WHERE potteryItemId = ?;
  `
  await db.runAsync(query, [potteryItemId])
}

export const deletePotteryItemFiringsTable = async (db: SQLiteDatabase): Promise<void> => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${POTTERY_ITEM_FIRINGS_TABLE_NAME};
  `
  await db.execAsync(deleteTableQuery)
}

export const resetFiringsTable = async (db: SQLiteDatabase) => {
  try {
    await deletePotteryItemFiringsTable(db)
    await createPotteryItemFiringsTable(db)
    console.log('Firings table reset successfully.')
  } catch (error) {
    console.error('Error resetting the firings table:', error)
    throw error
  }
}
