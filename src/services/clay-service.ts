import type { SQLiteDatabase } from 'expo-sqlite'
import type { Clay } from '../models'

const TABLE_NAME = 'Clays'

export const createClayTable = async (db: SQLiteDatabase) => {
  const query = `
	CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        clayId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        manufacturer TEXT,
        notes TEXT
    );`

  await db.execAsync(query)
}

export const getClays = async (db: SQLiteDatabase): Promise<Clay[]> => {
  const getAllQuery = `SELECT * FROM ${TABLE_NAME}`
  const result = await db.getAllAsync(getAllQuery)
  return result as Clay[]
}

export const getClayById = async (db: SQLiteDatabase, id: string): Promise<Clay | null> => {
  const getQuery = `SELECT * FROM ${TABLE_NAME} WHERE clayId = ?`
  const result = await db.getFirstAsync(getQuery)
  return result ? (result as Clay) : null
}

export const addClay = async (db: SQLiteDatabase, clay: Clay) => {
  const addQuery = `
	INSERT INTO ${TABLE_NAME} (
	clayId, name, manufacturer, notes
	) VALUES (
		'${clay.clayId}', 
		'${clay.name}', 
		'${clay.manufacturer}', 
		'${clay.notes}'
	);`

  await db.execAsync(addQuery)
}

export const updateClay = async (db: SQLiteDatabase, clay: Clay) => {
  const updateQuery = `
    UPDATE ${TABLE_NAME}
    SET 
		name = '${clay.name}',
		manufacturer = '${clay.manufacturer}', 
		notes = '${clay.notes}'
    WHERE clayId = '${clay.clayId}';`

  await db.execAsync(updateQuery)
}

export const deleteClayById = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE clayId = ${id}`
  await db.execAsync(deleteQuery)
}

export const deleteClayTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS ${TABLE_NAME}`
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
