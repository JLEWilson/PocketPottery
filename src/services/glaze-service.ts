import type { SQLiteDatabase } from 'expo-sqlite'
import { SQLResultSet } from 'expo-sqlite'
import type { Glaze } from '../models'

const TABLE_NAME = 'glaze'

export const createGlazeTable = async (db: SQLiteDatabase) => {
	// create table if not exists
	const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        glazeId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        manufacturer TEXT,
        notes TEXT
    );`

	db.transaction(
		(tx) => {
			tx.executeSql(query)
		}
	)
}

export const getGlazes = async (db: SQLiteDatabase): Promise<Glaze[]> => {
	const getAllQuery = `SELECT * FROM ${TABLE_NAME}`
	return new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					getAllQuery,
					[],
					(_, results: SQLResultSet) => {
						const glazes: Glaze[] = []
						for (let i = 0; i < results.rows.length; i++) {
							glazes.push(results.rows.item(i) as Glaze)
						}
						resolve(glazes)
					},
					(_, error) => {
						console.log(`Error executing SELECT query: ${error.message}`)
						return true
					}
				)
			},
			(error) => {
				reject(new Error(`Transaction error: ${error.message}`))
			}
		)
	})
}

export const getGlazeById = async (
	db: SQLiteDatabase,
	id: string
): Promise<Glaze | null> => {
	const getQuery = `SELECT * FROM ${TABLE_NAME} WHERE glazeId = ?`
	return new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					getQuery,
					[id],
					(_, results: SQLResultSet) => {
						if (results.rows.length === 1) {
							// Assuming glazeId is unique, so there should be at most one result
							const glaze = results.rows.item(0) as Glaze
							resolve(glaze)
						} else {
							resolve(null) // Return null if no matching item is found
						}
					},
					(_, error) => {
						console.log(`Error executing SELECT query: ${error.message}`)
						return true
					}
				)
			},
			(error) => {
				reject(new Error(`Transaction error: ${error.message}`))
			}
		)
	})
}

export const addGlaze = async (db: SQLiteDatabase, glaze: Glaze) => {
	const addQuery = `INSERT INTO ${TABLE_NAME} (glazeId, name, manufacturer, notes) VALUES (?, ?, ?, ?)`
	db.transaction(tx => {
		tx.executeSql(
			addQuery,
			[
				glaze.glazeId,
				glaze.name,
				glaze.manufacturer,
				glaze.notes,
			],
		)
	})
}

export const updateGlaze = async (db: SQLiteDatabase, glaze: Glaze) => {
  const updateQuery = `
    UPDATE ${TABLE_NAME}
    SET name = ?, manufacturer = ?, notes = ?
    WHERE glazeId = ?
  `;

  db.transaction((tx) => {
    tx.executeSql(
      updateQuery,
      [
            glaze.glazeId,
	    	glaze.name,
			glaze.manufacturer,
			glaze.notes,
      ],
    );
  });
};

export const deleteGlazeById = async (db: SQLiteDatabase, id: string) => {
	const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE glazeId = ${id}`
	await db.transaction((tx) => {
		tx.executeSql(deleteQuery)
	})
}

export const deleteTable = async (db: SQLiteDatabase) => {
	const query = `DROP TABLE ${TABLE_NAME}`
	await db.transaction((tx) => {
		tx.executeSql(query)
	})
}
