import { SQLiteDatabase } from 'expo-sqlite'
import { PotteryItemMeasurements } from '../models'

export const POTTERY_ITEM_MEASUREMENTS_TABLE_NAME = 'PotteryItemMeasurements'

export const createPotteryItemMeasurementsTable = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_MEASUREMENTS_TABLE_NAME} (
      measurementId TEXT PRIMARY KEY,
      potteryItemId TEXT NOT NULL,
      name TEXT NOT NULL,
      system TEXT,
      scale REAL,
      FOREIGN KEY (potteryItemId) REFERENCES PotteryItems (potteryItemId) ON DELETE CASCADE
    );
  `
  try {
    await db.execAsync(createTableQuery)
    console.log('PotteryItemMeasurements table created successfully.')
  } catch (error) {
    console.error('Error creating PotteryItemMeasurements table:', error)
  }
}

export const addPotteryItemMeasurement = async (
  db: SQLiteDatabase,
  measurement: PotteryItemMeasurements,
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_MEASUREMENTS_TABLE_NAME} (measurementId, potteryItemId, name, system, scale)
    VALUES (?, ?, ?, ?, ?);
  `
  try {
    await db.runAsync(query, [measurement.measurementId, measurement.potteryItemId, measurement.name, measurement.system, measurement.scale])
    console.log(`Measurement ${measurement.measurementId} added for pottery item ${measurement.potteryItemId}.`)
  } catch (error) {
    console.error('Error adding pottery item measurement:', error)
  }
}

export const getMeasurementsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<PotteryItemMeasurements[] | null> => {
  const query = `
    SELECT *
    FROM ${POTTERY_ITEM_MEASUREMENTS_TABLE_NAME}
    WHERE potteryItemId = ?;
  `
  try {
    const result = await db.getAllAsync(query, [potteryItemId])
    return result ? (result as PotteryItemMeasurements[]) : null
  } catch (error) {
    console.error(`Error fetching measurements for pottery item ${potteryItemId}:`, error)
    return null
  }
}

export const deleteMeasurement = async (
  db: SQLiteDatabase,
  measurementId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_MEASUREMENTS_TABLE_NAME}
    WHERE measurementId = ?;
  `
  try {
    await db.runAsync(query, [measurementId])
    console.log(`Measurement ${measurementId} deleted.`)
  } catch (error) {
    console.error('Error deleting pottery item measurement:', error)
  }
}

export const deleteMeasurementsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_MEASUREMENTS_TABLE_NAME}
    WHERE potteryItemId = ?;
  `
  try {
    await db.runAsync(query, [potteryItemId])
    console.log(`All measurements for pottery item ${potteryItemId} deleted.`)
  } catch (error) {
    console.error(`Error deleting measurements for pottery item ${potteryItemId}:`, error)
  }
}

export const deletePotteryItemMeasurementsTable = async (db: SQLiteDatabase): Promise<void> => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${POTTERY_ITEM_MEASUREMENTS_TABLE_NAME};
  `
  try {
    await db.execAsync(deleteTableQuery)
    console.log('PotteryItemMeasurements table deleted successfully.')
  } catch (error) {
    console.error('Error deleting PotteryItemMeasurements table:', error)
  }
}

export const resetMeasurementsTable = async (db: SQLiteDatabase): Promise<void> => {
  try {
    await deletePotteryItemMeasurementsTable(db)
    await createPotteryItemMeasurementsTable(db)
    console.log('PotteryItemMeasurements table reset successfully.')
  } catch (error) {
    console.error('Error resetting PotteryItemMeasurements table:', error)
    throw error
  }
}
