import type { SQLiteDatabase } from 'expo-sqlite'
import { SQLResultSet } from 'expo-sqlite'
import { PotteryItem } from '../models'

const TABLE_NAME = 'potteryItem'

export const createPotteryItemTable = async (db: SQLiteDatabase) => {
	// create table if not exists
	const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        potteryItemId TEXT PRIMARY KEY,
        dateCreated TEXT NOT NULL,
        dateEdited TEXT NOT NULL,
        projectTitle TEXT NOT NULL,
        projectNotes TEXT,
        displayPicturePath TEXT
    );`

	db.transaction(
		(tx) => {
			tx.executeSql(query)
		}
	)
}

export const getPotteryItems = async (db: SQLiteDatabase): Promise<PotteryItem[]> => {
	const getAllQueryy = `SELECT * FROM ${TABLE_NAME}`
	return new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					getAllQueryy,
					[],
					(_, results: SQLResultSet) => {
						const potteryItems: PotteryItem[] = []
						for (let i = 0; i < results.rows.length; i++) {
							potteryItems.push(results.rows.item(i) as PotteryItem)
						}
						resolve(potteryItems)
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

export const getPotteryItemById = async (
	db: SQLiteDatabase,
	id: string
): Promise<PotteryItem | null> => {
	const getQuery = `SELECT * FROM ${TABLE_NAME} WHERE potteryItemId = ?`
	return new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(
					getQuery,
					[id],
					(_, results: SQLResultSet) => {
						if (results.rows.length === 1) {
							// Assuming potteryItemId is unique, so there should be at most one result
							const potteryItem = results.rows.item(0) as PotteryItem
							resolve(potteryItem)
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

export const addPotteryItem =  async (db: SQLiteDatabase, potteryItem: PotteryItem) => {
	console.log(potteryItem)
	const addQuery = `INSERT INTO ${TABLE_NAME} (potteryItemId, dateCreated, dateEdited, projectTitle, projectNotes, displayPicturePath) VALUES (?, ?, ?, ?, ?, ?)`
	db.transaction(tx => {
		tx.executeSql(
			addQuery,
			[
			potteryItem.potteryItemId,
			potteryItem.dateCreated,
			potteryItem.dateEdited,
			potteryItem.projectTitle,
			potteryItem.projectNotes,
			potteryItem.displayPicturePath,
			],
			() => {
			console.log("Pottery item added successfully!");
			},
			(_, error) => {
			console.log("Error adding pottery item:", error.message);
			return true;
			}
		);
	});

}

export const updatePotteryItem = async (db: SQLiteDatabase, potteryItem: PotteryItem) => {
  const updateQuery = `
    UPDATE ${TABLE_NAME}
    SET dateEdited = ?, projectTitle = ?, projectNotes = ?, displayPicturePath = ?
    WHERE potteryItemId = ?
  `;

  db.transaction((tx) => {
    tx.executeSql(
      updateQuery,
      [
        potteryItem.dateEdited,
        potteryItem.projectTitle,
        potteryItem.projectNotes,
        potteryItem.displayPicturePath,
        potteryItem.potteryItemId,
      ],
    );
  });
};

export const deletePotteryItemById = async (db: SQLiteDatabase, id: string) => {
	const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE potteryItemId = ${id}`
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
export const resetPotteryItemTable = async (db: SQLiteDatabase) => {
	const dropQuery = `DROP TABLE IF EXISTS potteryItem`;
	const createQuery = `CREATE TABLE IF NOT EXISTS potteryItem (
	  potteryItemId TEXT PRIMARY KEY,
	  dateCreated TEXT NOT NULL,
	  dateEdited TEXT NOT NULL,
	  projectTitle TEXT NOT NULL,
	  projectNotes TEXT,
	  displayPicturePath TEXT
	);`;
  
	db.transaction(tx => {
	  tx.executeSql(dropQuery, [], () => console.log("Table dropped."));
	  tx.executeSql(createQuery, [], () => console.log("Table recreated."));
	});
  };
  