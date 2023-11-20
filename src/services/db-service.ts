import type { SQLiteDatabase } from 'expo-sqlite'
import { openDatabase, SQLResultSet } from 'expo-sqlite'
import { PotteryItem } from '../models'

const TABLE_NAME = 'potteryItem'


export const getDBConnection = async ():Promise<SQLiteDatabase> => {
	const db = openDatabase( 'pocket-pottery.db') 
	return db
}

//edit in new values after changing model
export const createTable = async (db: SQLiteDatabase) => {
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