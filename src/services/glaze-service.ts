import type { SQLiteDatabase } from 'expo-sqlite'
import type { Glaze } from '../models'

export const GLAZE_TABLE_NAME = 'Glazes'

export const createGlazeTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${GLAZE_TABLE_NAME}(
        glazeId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        manufacturer TEXT,
        notes TEXT
    );`

  db.execAsync(query)
}

export const getGlazes = async (db: SQLiteDatabase): Promise<Glaze[]> => {
  const getAllQuery = `SELECT * FROM ${GLAZE_TABLE_NAME}`
  const result = await db.getAllAsync(getAllQuery)
  return result as Glaze[]
}

export const getGlazeById = async (db: SQLiteDatabase, id: string): Promise<Glaze | null> => {
  const getQuery = `SELECT * FROM ${GLAZE_TABLE_NAME} WHERE glazeId = ?`
  const result = await db.getFirstAsync(getQuery)
  return result ? (result as Glaze) : null
}

export const addGlaze = async (db: SQLiteDatabase, glaze: Glaze) => {
  const addQuery = `
	INSERT INTO ${GLAZE_TABLE_NAME} (
	glazeId, name, manufacturer, notes
	) VALUES (?, ?, ?, ?, ?, ?);`

  await db.runAsync(addQuery, [glaze.glazeId, glaze.name, glaze.manufacturer, glaze.notes, glaze.type || '', glaze.idCode || ''])
}

export const updateGlaze = async (db: SQLiteDatabase, glaze: Glaze): Promise<void> => {
  const updateQuery = `
    UPDATE ${GLAZE_TABLE_NAME}
    SET 
      name = ?, 
      manufacturer = ?, 
      notes = ?,
      type = ?,
      idCode = ?
    WHERE glazeId = ?;
  `;

  try {
    await db.runAsync(updateQuery, [glaze.name, glaze.manufacturer, glaze.notes, glaze.glazeId, glaze.type || '', glaze.idCode || '']);
    console.log('Glaze updated successfully!');
  } catch (error) {
    console.error('Error updating glaze:', error);
    throw error;
  }
};

export const deleteGlazeById = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE FROM ${GLAZE_TABLE_NAME} WHERE glazeId = ?`
  await db.runAsync(deleteQuery, id)
}

export const deleteGlazeTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS ${GLAZE_TABLE_NAME}`
  await db.execAsync(query)
}

export const resetGlazeTable = async (db: SQLiteDatabase) => {
  try {
    await deleteGlazeTable(db)
    await createGlazeTable(db)
    console.log('Glaze table reset successfully.')
  } catch (error) {
    console.error('Error resetting the glaze table:', error)
    throw error
  }
}
