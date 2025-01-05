import type { SQLiteDatabase } from 'expo-sqlite'
import type { Clay } from '../models'

export const CLAY_TABLE_NAME = 'Clays'

export const createClayTable = async (db: SQLiteDatabase) => {
  const query = `
	CREATE TABLE IF NOT EXISTS ${CLAY_TABLE_NAME}(
        clayId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        manufacturer TEXT,
        notes TEXT
    );`
  try {
    await db.execAsync(query)
    console.log('Clay table created successfully.')
  } catch (error) {
    console.error('Error creating the clay table:', error)
  }
}

export const getClays = async (db: SQLiteDatabase): Promise<Clay[]> => {
  const getAllQuery = `SELECT * FROM ${CLAY_TABLE_NAME}`
  try {
    const result = await db.getAllAsync(getAllQuery)
    return result as Clay[]
  } catch (error) {
    console.error('Error fetching clays:', error)
    return []
  }
}

export const getClayById = async (db: SQLiteDatabase, id: string): Promise<Clay | null> => {
  const getQuery = `SELECT * FROM ${CLAY_TABLE_NAME} WHERE clayId = ?`
  try {
    const result = await db.getFirstAsync(getQuery, [id])
    return result ? (result as Clay) : null
  } catch (error) {
    console.error(`Error fetching clay with ID ${id}:`, error)
    return null
  }
}

export const addClay = async (db: SQLiteDatabase, clay: Clay) => {
  const addQuery = `
    INSERT INTO ${CLAY_TABLE_NAME} (
    clayId, name, manufacturer, notes, type, firingRange
    ) VALUES (?, ?, ?, ?, ?, ?);`
  try {
    await db.runAsync(addQuery, [
      clay.clayId,
      clay.name,
      clay.manufacturer,
      clay.notes,
      clay.type || '',
      clay.firingRange || '',
    ])
    console.log(`Clay with ID ${clay.clayId} added successfully.`)
  } catch (error) {
    console.error('Error adding clay:', error)
  }
}

export const updateClay = async (db: SQLiteDatabase, clay: Clay) => {
  const updateQuery = `
    UPDATE ${CLAY_TABLE_NAME}
    SET
      name = ?, 
      manufacturer = ?, 
      notes = ?,
      type = ?,
      firingRange = ?
		WHERE clayId = ?;`
  try {
    await db.runAsync(updateQuery, [
      clay.name,
      clay.manufacturer,
      clay.notes,
      clay.type || '',
      clay.firingRange || '',
      clay.clayId,
    ])
    console.log(`Clay with ID ${clay.clayId} updated successfully.`)
  } catch (error) {
    console.error('Error updating clay:', error)
  }
}

export const deleteClayById = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE FROM ${CLAY_TABLE_NAME} WHERE clayId = ?`
  try {
    await db.runAsync(deleteQuery, [id])
    console.log(`Clay with ID ${id} deleted successfully.`)
  } catch (error) {
    console.error(`Error deleting clay with ID ${id}:`, error)
  }
}

export const deleteClayTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS ${CLAY_TABLE_NAME}`
  try {
    await db.execAsync(query)
    console.log('Clay table deleted successfully.')
  } catch (error) {
    console.error('Error deleting the clay table:', error)
  }
}

export const resetClayTable = async (db: SQLiteDatabase) => {
  try {
    await deleteClayTable(db)
    await createClayTable(db)
    console.log('Clay table reset successfully.')
  } catch (error) {
    console.error('Error resetting the clay table:', error)
    throw error
  }
}
