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
	console.log('Glaze Table Created')
}

export const getGlazes = async (db: SQLiteDatabase): Promise<Glaze[]> => {
	const getAllQuery = `SELECT * FROM ${TABLE_NAME}`
	const result = await db.getAllAsync(getAllQuery)
	return result as Glaze[]
	
}

export const getGlazeById = async (
	db: SQLiteDatabase,
	id: string
): Promise<Glaze | null> => {
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
	);`;

	await db.execAsync(addQuery)
	console.log('Glaze added successfully!')
}

export const updateGlaze = async (db: SQLiteDatabase, glaze: Glaze) => {
	const updateQuery = `
    UPDATE ${TABLE_NAME}
    SET 
		name = '${glaze.name}',
		manufacturer = '${glaze.manufacturer}', 
		notes = '${glaze.notes}'
    WHERE clayId = '${glaze.glazeId}';`;

	await db.execAsync(updateQuery)
	console.log('Glaze updated successfully!');
};

export const deleteGlazeById = async (db: SQLiteDatabase, id: string) => {
	const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE glazeId = ${id}`
	await db.execAsync(deleteQuery)
	console.log('Glaze deleted successfully')
}

export const deleteTable = async (db: SQLiteDatabase) => {
	const query = `DROP TABLE IF EXISTS ${TABLE_NAME}`
	await db.execAsync(query);
	console.log('Glaze table dropped.');
}
