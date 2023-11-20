import type { SQLiteDatabase } from 'expo-sqlite'
import { openDatabase, SQLResultSet } from 'expo-sqlite'
import { PotteryItem } from '../models'

const TABLE_NAME = 'potteryItem'


export const getDBConnection = async ():Promise<SQLiteDatabase> => {
	const db = openDatabase( 'pocket-pottery.db') 
	return db
}
