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
      FOREIGN KEY (glazeId) REFERENCES Glazes (glazeId) ON DELETE CASCADE
    );
  `
  try {
    await db.execAsync(createTableQuery)
    console.log('PotteryItemGlazes table created successfully.')
  } catch (error) {
    console.error('Error creating PotteryItemGlazes table:', error)
  }
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
  try {
    await db.runAsync(query, [potteryItemId, glazeId])
    console.log(`Pottery item ${potteryItemId} linked with glaze ${glazeId}.`)
  } catch (error) {
    console.error('Error adding pottery item glaze link:', error)
  }
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
  try {
    await db.runAsync(query, [potteryItemId, glazeId])
    console.log(`Pottery item ${potteryItemId} link with glaze ${glazeId} removed.`)
  } catch (error) {
    console.error('Error removing pottery item glaze link:', error)
  }
}

export const getGlazesByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<Glaze[] | null> => {
  const query = `
    SELECT g.*
    FROM Glazes g
    INNER JOIN ${POTTERY_ITEM_GLAZES_TABLE_NAME} pg ON g.glazeId = pg.glazeId
    WHERE pg.potteryItemId = ?;
  `
  try {
    const result = await db.getAllAsync(query, [potteryItemId])
    return result ? (result as Glaze[]) : null
  } catch (error) {
    console.error(`Error fetching glazes for pottery item ${potteryItemId}:`, error)
    return null
  }
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
  try {
    const result = await db.getAllAsync(query, [glazeId])
    return result ? (result as PotteryItem[]) : null
  } catch (error) {
    console.error(`Error fetching pottery items for glaze ${glazeId}:`, error)
    return null
  }
}

export const getAllPotteryItemGlazeLinks = async (
  db: SQLiteDatabase,
): Promise<PotteryItemGlazes[] | null> => {
  const query = `
    SELECT * FROM ${POTTERY_ITEM_GLAZES_TABLE_NAME};
  `
  try {
    const result = await db.getAllAsync(query)
    return result ? (result as PotteryItemGlazes[]) : null
  } catch (error) {
    console.error('Error fetching all pottery item glaze links:', error)
    return null
  }
}

export const deletePotteryItemGlazeTable = async (db: SQLiteDatabase): Promise<void> => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${POTTERY_ITEM_GLAZES_TABLE_NAME};
  `
  try {
    await db.execAsync(deleteTableQuery)
    console.log('PotteryItemGlazes table deleted successfully.')
  } catch (error) {
    console.error('Error deleting PotteryItemGlazes table:', error)
  }
}

export const resetPotteryItemGlazesTable = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await deletePotteryItemGlazeTable(db)
    await createPotteryItemGlazesTable(db)
    console.log('PotteryItemGlazes table reset successfully.')
  } catch (error) {
    console.error('Error resetting PotteryItemGlazes table:', error)
    throw error
  }
}
