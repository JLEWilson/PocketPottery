import { SQLiteDatabase } from 'expo-sqlite'
import { PotteryItemMeasurements } from '../models'

export const POTTERY_ITEM_MEASUREMENTS_TABLE = 'PotteryItemMeasurements'

export const createPotteryItemMeasurementsTable = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_MEASUREMENTS_TABLE} (
      measurementId TEXT PRIMARY KEY,
      potteryItemId TEXT NOT NULL,
      name TEXT NOT NULL,
      system TEXT,
      scale REAL,
      FOREIGN KEY (potteryItemId) REFERENCES PotteryItems (potteryItemId) ON DELETE CASCADE
    );
  `
  await db.execAsync(createTableQuery)
}

export const addPotteryItemMeasurement = async (
  db: SQLiteDatabase,
  measurement: PotteryItemMeasurements,
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_MEASUREMENTS_TABLE} (measurementId, potteryItemId, name, system, scale)
    VALUES ('${measurement.measurementId}', '${measurement.potteryItemId}', '${measurement.name}', '${measurement.system}', ${measurement.scale});
  `
  await db.execAsync(query)
}

export const getMeasurementsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<PotteryItemMeasurements[] | null> => {
  const query = `
    SELECT *
    FROM ${POTTERY_ITEM_MEASUREMENTS_TABLE}
    WHERE potteryItemId = '${potteryItemId}';
  `
  const result = await db.getAllAsync(query)
  return result ? (result as PotteryItemMeasurements[]) : null // Returns all measurements for the specified pottery item
}

export const deleteMeasurement = async (
  db: SQLiteDatabase,
  measurementId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_MEASUREMENTS_TABLE}
    WHERE measurementId = '${measurementId}';
  `
  await db.execAsync(query)
}

export const deleteMeasurementsByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_MEASUREMENTS_TABLE}
    WHERE potteryItemId = '${potteryItemId}';
  `
  await db.execAsync(query)
}

export const deletePotteryItemMeasurementsTable = async (db: SQLiteDatabase): Promise<void> => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${POTTERY_ITEM_MEASUREMENTS_TABLE};
  `
  await db.execAsync(deleteTableQuery)
}

export const resetMeasurementsTable = async (db: SQLiteDatabase) => {
  try {
    await deletePotteryItemMeasurementsTable(db)
    await createPotteryItemMeasurementsTable(db)
    console.log('Firings table reset successfully.')
  } catch (error) {
    console.error('Error resetting the firings table:', error)
    throw error
  }
}
