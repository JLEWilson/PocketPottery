import React, { createContext, useContext, useEffect, useState } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { getDBConnection } from '../services/db-service' // Import getDBConnection
import type { SQLiteDatabase } from 'expo-sqlite'
import { useTheme } from '@react-navigation/native'
const DatabaseContext = createContext<SQLiteDatabase | null>(null)

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null)
  const {colors} = useTheme()
  useEffect(() => {
    const initializeDB = async () => {
      try {
        const database = await getDBConnection()
        setDb(database)
      } catch (error) {
        console.error('Failed to initialize the database:', (error as Error).message)
      }
    }

    initializeDB()
  }, [])

  if (!db) {
    // loading
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Initializing database...</Text>
      </View>
    )
  }

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
}

export const useDatabase = (): SQLiteDatabase => {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}
