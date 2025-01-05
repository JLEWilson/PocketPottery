import { SQLiteDatabase } from 'expo-sqlite'
import { Clay, PotteryItem, PotteryItemClays } from '../models'

export const POTTERY_ITEM_CLAYS_TABLE_NAME = 'PotteryItemClays'

export const createPotteryItemClaysTable = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_CLAYS_TABLE_NAME} (
      potteryItemId TEXT NOT NULL,
      clayId TEXT NOT NULL,
      PRIMARY KEY (potteryItemId, clayId),
      FOREIGN KEY (potteryItemId) REFERENCES PotteryItems (potteryItemId) ON DELETE CASCADE,
      FOREIGN KEY (clayId) REFERENCES Clays (clayId) ON DELETE CASCADE
    );
  `
  try {
    await db.execAsync(createTableQuery)
    console.log('PotteryItemClays table created successfully.')
  } catch (error) {
    console.error('Error creating PotteryItemClays table:', error)
  }
}

export const addPotteryItemClayLink = async (
  db: SQLiteDatabase,
  potteryItemId: string,
  clayId: string,
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_CLAYS_TABLE_NAME} (potteryItemId, clayId)
    VALUES (?, ?);
  `
  try {
    await db.runAsync(query, [potteryItemId, clayId])
    console.log(`Link added between pottery item (${potteryItemId}) and clay (${clayId}).`)
  } catch (error) {
    console.error('Error adding pottery item-clay link:', error)
  }
}

export const removePotteryItemClayLink = async (
  db: SQLiteDatabase,
  potteryItemId: string,
  clayId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_CLAYS_TABLE_NAME}
    WHERE potteryItemId = ? AND clayId = ?;
  `
  try {
    await db.runAsync(query, [potteryItemId, clayId])
    console.log(`Link removed between pottery item (${potteryItemId}) and clay (${clayId}).`)
  } catch (error) {
    console.error('Error removing pottery item-clay link:', error)
  }
}

export const getClaysByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<Clay[] | null> => {
  const query = `
    SELECT c.*
    FROM Clays c
    INNER JOIN ${POTTERY_ITEM_CLAYS_TABLE_NAME} pc ON c.clayId = pc.clayId
    WHERE pc.potteryItemId = ?;  
  `
  try {
    const result = await db.getAllAsync(query, [potteryItemId])
    return result ? (result as Clay[]) : null
  } catch (error) {
    console.error(`Error fetching clays for pottery item (${potteryItemId}):`, error)
    return null
  }
}

export const getPotteryItemsByClayId = async (
  db: SQLiteDatabase,
  clayId: string,
): Promise<PotteryItem[] | null> => {
  const query = `
    SELECT p.*
    FROM PotteryItems p
    INNER JOIN ${POTTERY_ITEM_CLAYS_TABLE_NAME} pc ON p.potteryItemId = pc.potteryItemId
    WHERE pc.clayId = ?; 
  `
  try {
    const result = await db.getAllAsync(query, [clayId])
    return result ? (result as PotteryItem[]) : null
  } catch (error) {
    console.error(`Error fetching pottery items for clay (${clayId}):`, error)
    return null
  }
}

export const getAllPotteryItemClayLinks = async (
  db: SQLiteDatabase,
): Promise<PotteryItemClays[] | null> => {
  const query = `
    SELECT * FROM ${POTTERY_ITEM_CLAYS_TABLE_NAME};
  `
  try {
    const result = await db.getAllAsync(query)
    return result ? (result as PotteryItemClays[]) : null
  } catch (error) {
    console.error('Error fetching all pottery item-clay links:', error)
    return null
  }
}

export const deletePotteryItemClaysTable = async (db: SQLiteDatabase): Promise<void> => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${POTTERY_ITEM_CLAYS_TABLE_NAME};
  `
  try {
    await db.execAsync(deleteTableQuery)
    console.log('PotteryItemClays table deleted successfully.')
  } catch (error) {
    console.error('Error deleting PotteryItemClays table:', error)
  }
}

export const resetPotteryItemClaysTable = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await deletePotteryItemClaysTable(db)
    await createPotteryItemClaysTable(db)
    console.log('PotteryItemClays table reset successfully.')
  } catch (error) {
    console.error('Error resetting PotteryItemClays table:', error)
    throw error
  }
}
