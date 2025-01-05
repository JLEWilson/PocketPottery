import type { SQLiteDatabase } from 'expo-sqlite'
import type { Glaze } from '../models'

export const GLAZE_TABLE_NAME = 'Glazes'

export const createGlazeTable = async (db: SQLiteDatabase) => {
  const query = `
    CREATE TABLE IF NOT EXISTS ${GLAZE_TABLE_NAME}(
      glazeId TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      manufacturer TEXT,
      notes TEXT,
      type TEXT,
      idCode TEXT
    );`
  try {
    await db.execAsync(query)
    console.log('Glaze table created successfully.')
  } catch (error) {
    console.error('Error creating the glaze table:', error)
  }
}

export const getGlazes = async (db: SQLiteDatabase): Promise<Glaze[]> => {
  const getAllQuery = `SELECT * FROM ${GLAZE_TABLE_NAME}`
  try {
    const result = await db.getAllAsync(getAllQuery)
    return result as Glaze[]
  } catch (error) {
    console.error('Error fetching glazes:', error)
    return []
  }
}

export const getGlazeById = async (db: SQLiteDatabase, id: string): Promise<Glaze | null> => {
  const getQuery = `SELECT * FROM ${GLAZE_TABLE_NAME} WHERE glazeId = ?`
  try {
    const result = await db.getFirstAsync(getQuery, [id])
    return result ? (result as Glaze) : null
  } catch (error) {
    console.error(`Error fetching glaze with ID ${id}:`, error)
    return null
  }
}

export const addGlaze = async (db: SQLiteDatabase, glaze: Glaze) => {
  const addQuery = `
    INSERT INTO ${GLAZE_TABLE_NAME} (
      glazeId, name, manufacturer, notes, type, idCode
    ) VALUES (?, ?, ?, ?, ?, ?);`
  try {
    await db.runAsync(addQuery, [
      glaze.glazeId,
      glaze.name,
      glaze.manufacturer,
      glaze.notes,
      glaze.type || '',
      glaze.idCode || '',
    ])
    console.log(`Glaze with ID ${glaze.glazeId} added successfully.`)
  } catch (error) {
    console.error('Error adding glaze:', error)
  }
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
  `
  try {
    await db.runAsync(updateQuery, [
      glaze.name,
      glaze.manufacturer,
      glaze.notes,
      glaze.type || '',
      glaze.idCode || '',
      glaze.glazeId,
    ])
    console.log(`Glaze with ID ${glaze.glazeId} updated successfully.`)
  } catch (error) {
    console.error('Error updating glaze:', error)
  }
}

export const deleteGlazeById = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE FROM ${GLAZE_TABLE_NAME} WHERE glazeId = ?`
  try {
    await db.runAsync(deleteQuery, [id])
    console.log(`Glaze with ID ${id} deleted successfully.`)
  } catch (error) {
    console.error(`Error deleting glaze with ID ${id}:`, error)
  }
}

export const deleteGlazeTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS ${GLAZE_TABLE_NAME}`
  try {
    await db.execAsync(query)
    console.log('Glaze table deleted successfully.')
  } catch (error) {
    console.error('Error deleting the glaze table:', error)
  }
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
