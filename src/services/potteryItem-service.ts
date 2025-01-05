import { SQLiteDatabase } from 'expo-sqlite';
import { PotteryItem } from '../models';

export const POTTERY_ITEM_TABLE_NAME = 'PotteryItems';

// Create Table
export const createPotteryItemTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_TABLE_NAME} (
      potteryItemId TEXT PRIMARY KEY,
      dateCreated TEXT NOT NULL,
      dateEdited TEXT NOT NULL,
      projectTitle TEXT NOT NULL,
      projectNotes TEXT,
      displayPicturePath TEXT
    );`;

  try {
    await db.execAsync(query);
  } catch (error) {
    console.error('Error creating PotteryItem table:', error);
  }
};

// Get All Items
export const getPotteryItems = async (db: SQLiteDatabase): Promise<PotteryItem[]> => {
  const query = `SELECT * FROM ${POTTERY_ITEM_TABLE_NAME};`;

  try {
    const result = await db.getAllAsync(query);
    return result as PotteryItem[];
  } catch (error) {
    console.error('Error fetching pottery items:', error);
    return [];
  }
};

// Get Item by ID
export const getPotteryItemById = async (
  db: SQLiteDatabase,
  id: string
): Promise<PotteryItem | null> => {
  const query = `SELECT * FROM ${POTTERY_ITEM_TABLE_NAME} WHERE potteryItemId = ?;`;

  try {
    const result = await db.getFirstAsync(query, [id]);
    return result ? (result as PotteryItem) : null;
  } catch (error) {
    console.error(`Error fetching pottery item with ID ${id}:`, error);
    return null;
  }
};

// Add Item
export const addPotteryItem = async (db: SQLiteDatabase, potteryItem: PotteryItem) => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_TABLE_NAME} (
      potteryItemId, dateCreated, dateEdited, projectTitle, projectNotes, displayPicturePath, series
    ) VALUES (?, ?, ?, ?, ?, ?, ?);`;

  try {
    await db.runAsync(query, [
      potteryItem.potteryItemId,
      potteryItem.dateCreated,
      potteryItem.dateEdited,
      potteryItem.projectTitle,
      potteryItem.projectNotes,
      potteryItem.displayPicturePath,
      potteryItem.series || ''
    ]);
  } catch (error) {
    console.error('Error adding pottery item:', error);
  }
};

// Update Item
export const updatePotteryItem = async (db: SQLiteDatabase, potteryItem: PotteryItem) => {
  const query = `
    UPDATE ${POTTERY_ITEM_TABLE_NAME}
    SET
      dateEdited = ?,
      projectTitle = ?,
      projectNotes = ?,
      displayPicturePath = ?,
      series = ?
    WHERE potteryItemId = ?;`;

  try {
    await db.runAsync(query, [
      potteryItem.dateEdited,
      potteryItem.projectTitle,
      potteryItem.projectNotes,
      potteryItem.displayPicturePath,
      potteryItem.series || '',
      potteryItem.potteryItemId
    ]);
  } catch (error) {
    console.error('Error updating pottery item:', error);
  }
};

// Delete Item by ID
export const deletePotteryItemById = async (db: SQLiteDatabase, id: string) => {
  const query = `DELETE FROM ${POTTERY_ITEM_TABLE_NAME} WHERE potteryItemId = ?;`;

  try {
    await db.runAsync(query, [id]);
  } catch (error) {
    console.error(`Error deleting pottery item with ID ${id}:`, error);
  }
};

// Drop Table
export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS ${POTTERY_ITEM_TABLE_NAME};`;

  try {
    await db.execAsync(query);
    console.log('PotteryItem table dropped.');
  } catch (error) {
    console.error('Error dropping PotteryItem table:', error);
  }
};

// Reset Table
export const resetPotteryItemTable = async (db: SQLiteDatabase) => {
  const dropQuery = `DROP TABLE IF EXISTS ${POTTERY_ITEM_TABLE_NAME};`;
  const createQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_TABLE_NAME} (
      potteryItemId TEXT PRIMARY KEY,
      dateCreated TEXT NOT NULL,
      dateEdited TEXT NOT NULL,
      projectTitle TEXT NOT NULL,
      projectNotes TEXT,
      displayPicturePath TEXT
    );`;

  try {
    await db.execAsync(dropQuery);
    await db.execAsync(createQuery);
    console.log('PotteryItem table reset.');
  } catch (error) {
    console.error('Error resetting PotteryItem table:', error);
  }
};
