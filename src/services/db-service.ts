import type { SQLiteDatabase } from 'expo-sqlite'
import { openDatabase } from 'expo-sqlite'


export const getDBConnection = async ():Promise<SQLiteDatabase> => {
	const db = openDatabase( 'pocket-pottery.db') 
	return db
}