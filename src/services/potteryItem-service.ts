import type { SQLiteDatabase } from 'expo-sqlite'
import { SQLResultSet } from 'expo-sqlite'
import { PotteryItem } from '../models'

const TABLE_NAME = 'potteryItem'

export const createPotteryItemTable = async (db: SQLiteDatabase) => {
	// create table if not exists
	const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        potteryItemId INTEGER PRIMARY KEY AUTOINCREMENT,
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