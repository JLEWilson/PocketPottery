import { SQLiteDatabase } from 'expo-sqlite'
import { PotteryItem } from '../models'

const TABLE_NAME = 'PotteryItems'

// Create Table
export const createPotteryItemTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      potteryItemId TEXT PRIMARY KEY,
      dateCreated TEXT NOT NULL,
      dateEdited TEXT NOT NULL,
      projectTitle TEXT NOT NULL,
      projectNotes TEXT,
      displayPicturePath TEXT
    );`

  await db.execAsync(query)
}

// Get All Items
export const getPotteryItems = async (db: SQLiteDatabase): Promise<PotteryItem[]> => {
  const query = `SELECT * FROM ${TABLE_NAME};`
  const result = await db.getAllAsync(query)
  return result as PotteryItem[]
}

// Get Item by ID
export const getPotteryItemById = async (
  db: SQLiteDatabase,
  id: string,
): Promise<PotteryItem | null> => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE potteryItemId = '${id}';`
  const result = await db.getFirstAsync(query)

  return result ? (result as PotteryItem) : null
}

// Add Item
export const addPotteryItem = async (db: SQLiteDatabase, potteryItem: PotteryItem) => {
  const query = `
    INSERT INTO ${TABLE_NAME} (
      potteryItemId, dateCreated, dateEdited, projectTitle, projectNotes, displayPicturePath
    ) VALUES (
      '${potteryItem.potteryItemId}',
      '${potteryItem.dateCreated}',
      '${potteryItem.dateEdited}',
      '${potteryItem.projectTitle}',
      '${potteryItem.projectNotes}',
      '${potteryItem.displayPicturePath}'
    );`

  await db.execAsync(query)
}

// Update Item
export const updatePotteryItem = async (db: SQLiteDatabase, potteryItem: PotteryItem) => {
  const query = `
    UPDATE ${TABLE_NAME}
    SET
      dateEdited = '${potteryItem.dateEdited}',
      projectTitle = '${potteryItem.projectTitle}',
      projectNotes = '${potteryItem.projectNotes}',
      displayPicturePath = '${potteryItem.displayPicturePath}'
    WHERE potteryItemId = '${potteryItem.potteryItemId}';`

  await db.execAsync(query)
}

// Delete Item by ID
export const deletePotteryItemById = async (db: SQLiteDatabase, id: string) => {
  const query = `DELETE FROM ${TABLE_NAME} WHERE potteryItemId = '${id}';`
  await db.execAsync(query)
}

// Drop Table
export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS ${TABLE_NAME};`
  await db.execAsync(query)
  console.log('PotteryItem table dropped.')
}

// Reset Table
export const resetPotteryItemTable = async (db: SQLiteDatabase) => {
  const dropQuery = `DROP TABLE IF EXISTS ${TABLE_NAME};`
  const createQuery = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      potteryItemId TEXT PRIMARY KEY,
      dateCreated TEXT NOT NULL,
      dateEdited TEXT NOT NULL,
      projectTitle TEXT NOT NULL,
      projectNotes TEXT,
      displayPicturePath TEXT
    );`

  await db.execAsync(`${dropQuery} ${createQuery}`)
  console.log('PotteryItem table reset.')
}
