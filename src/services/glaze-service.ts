import type { SQLiteDatabase } from 'expo-sqlite'
import type { Glaze } from '../models'

const TABLE_NAME = 'Glazes'

export const createGlazeTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        glazeId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        manufacturer TEXT,
        notes TEXT
    );`

  db.execAsync(query)
}

export const getGlazes = async (db: SQLiteDatabase): Promise<Glaze[]> => {
  const getAllQuery = `SELECT * FROM ${TABLE_NAME}`
  const result = await db.getAllAsync(getAllQuery)
  return result as Glaze[]
}

export const getGlazeById = async (db: SQLiteDatabase, id: string): Promise<Glaze | null> => {
  const getQuery = `SELECT * FROM ${TABLE_NAME} WHERE glazeId = ?`
  const result = await db.getFirstAsync(getQuery)
  return result ? (result as Glaze) : null
}

export const addGlaze = async (db: SQLiteDatabase, glaze: Glaze) => {
  const addQuery = `
	INSERT INTO ${TABLE_NAME} (
	glazeId, name, manufacturer, notes
	) VALUES (
		'${glaze.glazeId}', 
		'${glaze.name}', 
		'${glaze.manufacturer}', 
		'${glaze.notes}'
	);`

  await db.execAsync(addQuery)
}

export const updateGlaze = async (db: SQLiteDatabase, glaze: Glaze) => {
  const updateQuery = `
    UPDATE ${TABLE_NAME}
    SET 
		name = '${glaze.name}',
		manufacturer = '${glaze.manufacturer}', 
		notes = '${glaze.notes}'
    WHERE clayId = '${glaze.glazeId}';`

  await db.execAsync(updateQuery)
  console.log('Glaze updated successfully!')
}

export const deleteGlazeById = async (db: SQLiteDatabase, id: string) => {
  const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE glazeId = ${id}`
  await db.execAsync(deleteQuery)
}

export const deleteGlazeTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS ${TABLE_NAME}`
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
