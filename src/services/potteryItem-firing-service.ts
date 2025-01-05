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
  try {
    await db.execAsync(createTableQuery)
    console.log('PotteryItemFirings table created successfully.')
  } catch (error) {
    console.error('Error creating PotteryItemFirings table:', error)
  }
}

export const addPotteryItemFiring = async (
  db: SQLiteDatabase,
  firing: PotteryItemFirings,
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_FIRINGS_TABLE_NAME} (firingId, potteryItemId, fireStyle, fireType, cone)
    VALUES (?, ?, ?, ?, ?);
  `
  try {
    await db.runAsync(query, [firing.firingId, firing.potteryItemId, firing.fireStyle, firing.fireType, firing.cone])
    console.log(`Firing added successfully for pottery item (${firing.potteryItemId}).`)
  } catch (error) {
    console.error('Error adding pottery item firing:', error)
  }
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
  try {
    const result = await db.getAllAsync(query, [potteryItemId])
    return result ? (result as PotteryItemFirings[]) : null
  } catch (error) {
    console.error(`Error fetching firings for pottery item (${potteryItemId}):`, error)
    return null
  }
}

export const deleteFiring = async (db: SQLiteDatabase, firingId: string): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_FIRINGS_TABLE_NAME}
    WHERE firingId = ?;
  `
  try {
    await db.runAsync(query, [firingId])
    console.log(`Firing with ID (${firingId}) deleted successfully.`)
  } catch (error) {
    console.error('Error deleting firing:', error)
  }
}

export const deleteFiringsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_FIRINGS_TABLE_NAME}
    WHERE potteryItemId = ?;
  `
  try {
    await db.runAsync(query, [potteryItemId])
    console.log(`All firings for pottery item (${potteryItemId}) deleted successfully.`)
  } catch (error) {
    console.error(`Error deleting firings for pottery item (${potteryItemId}):`, error)
  }
}

export const deletePotteryItemFiringsTable = async (db: SQLiteDatabase): Promise<void> => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${POTTERY_ITEM_FIRINGS_TABLE_NAME};
  `
  try {
    await db.execAsync(deleteTableQuery)
    console.log('PotteryItemFirings table deleted successfully.')
  } catch (error) {
    console.error('Error deleting PotteryItemFirings table:', error)
  }
}

export const resetFiringsTable = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await deletePotteryItemFiringsTable(db)
    await createPotteryItemFiringsTable(db)
    console.log('Firings table reset successfully.')
  } catch (error) {
    console.error('Error resetting the firings table:', error)
    throw error
  }
}
