import type { SQLiteDatabase } from 'expo-sqlite'
import { openDatabaseSync } from 'expo-sqlite'

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  const db = openDatabaseSync('pocket-pottery.db')
  return db
}
