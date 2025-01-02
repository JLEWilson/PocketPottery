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

  await db.execAsync(query)
}

export const getClays = async (db: SQLiteDatabase): Promise<Clay[]> => {
  const getAllQuery = `SELECT * FROM ${CLAY_TABLE_NAME}`
  const result = await db.getAllAsync(getAllQuery)
  return result as Clay[]
}

export const getClayById = async (db: SQLiteDatabase, id: string): Promise<Clay | null> => {
  const getQuery = `SELECT * FROM ${CLAY_TABLE_NAME} WHERE clayId = ?`
  const result = await db.getFirstAsync(getQuery)
  return result ? (result as Clay) : null
}

export const addClay = async (db: SQLiteDatabase, clay: Clay) => {
  const addQuery = `
	INSERT INTO ${CLAY_TABLE_NAME} (
	clayId, name, manufacturer, notes
	) VALUES (?, ?, ?, ?);`

  await db.runAsync(addQuery, [clay.clayId, clay.name, clay.manufacturer, clay.notes])
}

export const updateClay = async (db: SQLiteDatabase, clay: Clay) => {
  const updateQuery = `
    UPDATE ${CLAY_TABLE_NAME}
    SET
      name = ?, 
      manufacturer = ?, 
      notes = ?
		WHERE clayId = ?;`

  await db.runSync(updateQuery, [clay.name, clay.manufacturer, clay.notes, clay.clayId])
}

export const deleteClayById = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE FROM ${CLAY_TABLE_NAME} WHERE clayId = ?`
  await db.runAsync(deleteQuery, id)
}

export const deleteClayTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS ${CLAY_TABLE_NAME}`
  await db.execAsync(query)
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
