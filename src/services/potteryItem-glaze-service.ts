import { SQLiteDatabase } from 'expo-sqlite'
import { Glaze, PotteryItem, PotteryItemGlazes } from '../models'

export const POTTERY_ITEM_GLAZES_TABLE_NAME = 'PotteryItemGlazes'

export const createPotteryItemGlazesTable = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_GLAZES_TABLE_NAME} (
      potteryItemId TEXT NOT NULL,
      glazeId TEXT NOT NULL,
      PRIMARY KEY (potteryItemId, glazeId),
      FOREIGN KEY (potteryItemId) REFERENCES PotteryItems (potteryItemId) ON DELETE CASCADE,
      FOREIGN KEY (glazeId) REFERENCES Glaze (glazeId) ON DELETE CASCADE
    );
  `
  await db.execAsync(createTableQuery)
}

export const addPotteryItemGlazeLink = async (
  db: SQLiteDatabase,
  potteryItemId: string,
  glazeId: string,
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_GLAZES_TABLE_NAME} (potteryItemId, glazeId)
    VALUES (?, ?);
  `
  await db.runAsync(query, [potteryItemId, glazeId])
}

export const removePotteryItemGlazeLink = async (
  db: SQLiteDatabase,
  potteryItemId: string,
  glazeId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_GLAZES_TABLE_NAME}
    WHERE potteryItemId = ? AND glazeId = ?;
  `
  await db.runAsync(query, [potteryItemId, glazeId])
}

export const getGlazessByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<Glaze[] | null> => {
  const query = `
    SELECT g.*
    FROM Glazes g
    INNER JOIN ${POTTERY_ITEM_GLAZES_TABLE_NAME} pg ON g.glazeId = pg.glazeId
    WHERE pg.potteryItemId = ?;
  `
  const result = await db.getAllAsync(query, [potteryItemId])
  return result ? (result as Glaze[]) : null
}

export const getPotteryItemsByGlazeId = async (
  db: SQLiteDatabase,
  glazeId: string,
): Promise<PotteryItem[] | null> => {
  const query = `
    SELECT p.*
    FROM PotteryItems p
    INNER JOIN ${POTTERY_ITEM_GLAZES_TABLE_NAME} pg ON p.potteryItemId = pg.potteryItemId
    WHERE pg.glazeId = ?;
  `
  const result = await db.getAllAsync(query, [glazeId])
  return result ? (result as PotteryItem[]) : null
}

export const getAllPotteryItemGlazeLinks = async (
  db: SQLiteDatabase,
): Promise<PotteryItemGlazes[] | null> => {
  const query = `
    SELECT * FROM ${POTTERY_ITEM_GLAZES_TABLE_NAME};
  `
  const result = await db.getAllAsync(query)
  return result ? (result as PotteryItemGlazes[]) : null 
}

export const deletePotteryItemGlazeTable = async (db: SQLiteDatabase): Promise<void> => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${POTTERY_ITEM_GLAZES_TABLE_NAME};
  `
  await db.execAsync(deleteTableQuery)
}

export const resetPotteryItemGlazesTable = async (db: SQLiteDatabase) => {
  try {
    await deletePotteryItemGlazeTable(db)
    await createPotteryItemGlazesTable(db)
    console.log('potteryItemGlazes table reset successfully.')
  } catch (error) {
    console.error('Error resetting the potteryItemGlazes table:', error)
    throw error
  }
}
