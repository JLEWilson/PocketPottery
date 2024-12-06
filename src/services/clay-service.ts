import type { SQLiteDatabase } from 'expo-sqlite'
import { SQLResultSet } from 'expo-sqlite'
import type { Clay } from '../models'

const TABLE_NAME = 'clay'

export const createClayTable = async (db: SQLiteDatabase) => {
	// create table if not exists
	const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        clayId TEXT PRIMARY KEY,
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

export const getClays = async (db: SQLiteDatabase): Promise<Clay[]> => {
	const getAllQueryy = `SELECT * FROM ${TABLE_NAME}`
	return new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					getAllQueryy,
					[],
					(_, results: SQLResultSet) => {
						const clays: Clay[] = []
						for (let i = 0; i < results.rows.length; i++) {
							clays.push(results.rows.item(i) as Clay)
						}
						resolve(clays)
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

export const getClayById = async (
	db: SQLiteDatabase,
	id: string
): Promise<Clay | null> => {
	const getQuery = `SELECT * FROM ${TABLE_NAME} WHERE clayId = ?`
	return new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					getQuery,
					[id],
					(_, results: SQLResultSet) => {
						if (results.rows.length === 1) {
							// Assuming clayId is unique, so there should be at most one result
							const clay = results.rows.item(0) as Clay
							resolve(clay)
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

export const addClay =  async (db: SQLiteDatabase, clay: Clay) => {
	const addQuery = `INSERT INTO ${TABLE_NAME} (clayId, name, manufacturer, notes) VALUES (?, ?, ?, ?)`
	db.transaction(tx => {
		tx.executeSql(
			addQuery,
			[
				clay.clayId,
				clay.name,
				clay.manufacturer,
				clay.notes,
			],
		)
	})
}

export const updateClay = async (db: SQLiteDatabase, clay: Clay) => {
  const updateQuery = `
    UPDATE ${TABLE_NAME}
    SET name = ?, manufacturer = ?, notes = ?
    WHERE clayId = ?
  `;

  db.transaction((tx) => {
    tx.executeSql(
      updateQuery,
      [
            clay.clayId,
	    	clay.name,
			clay.manufacturer,
			clay.notes,
      ],
    );
  });
};

export const deleteClayById = async (db: SQLiteDatabase, id: string) => {
	const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE clayId = ${id}`
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