import { SQLiteDatabase } from 'expo-sqlite'
import { Glaze, PotteryItem, PotteryItemGlazes } from '../models'

export const POTTERY_ITEM_GLAZES_TABLE = 'PotteryItemGlazes'

export const createPotteryItemGlazesTable = async (db: SQLiteDatabase): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${POTTERY_ITEM_GLAZES_TABLE} (
      potteryItemId TEXT NOT NULL,
      glazeId TEXT NOT NULL,
      PRIMARY KEY (potteryItemId, glazeId),
      FOREIGN KEY (potteryItemId) REFERENCES PotteryItems (potteryItemId) ON DELETE CASCADE,
      FOREIGN KEY (glazeId) REFERENCES Glaze (glazeId) ON DELETE CASCADE
    );
  `
  await db.execAsync(createTableQuery)
}

export const addPotteryItemGlazeLink = async (
  db: SQLiteDatabase,
  potteryItemId: string,
  glazeId: string,
): Promise<void> => {
  const query = `
    INSERT INTO ${POTTERY_ITEM_GLAZES_TABLE} (potteryItemId, glazeId)
    VALUES ('${potteryItemId}', '${glazeId}');
  `
  await db.execAsync(query)
}

export const removePotteryItemGlazeLink = async (
  db: SQLiteDatabase,
  potteryItemId: string,
  glazeId: string,
): Promise<void> => {
  const query = `
    DELETE FROM ${POTTERY_ITEM_GLAZES_TABLE}
    WHERE potteryItemId = ${potteryItemId} AND glazeId = ${glazeId};
  `
  await db.execAsync(query)
}

export const getGlazessByPotteryItemId = async (
  db: SQLiteDatabase,
  potteryItemId: string,
): Promise<Glaze[] | null> => {
  const query = `
    SELECT g.*
    FROM Glazes g
    INNER JOIN ${POTTERY_ITEM_GLAZES_TABLE} pg ON g.glazeId = pg.glazeId
    WHERE pg.potteryItemId = ?;
  `
  const result = await db.getAllAsync(query, [potteryItemId])
  return result ? (result as Glaze[]) : null
}

export const getPotteryItemsByGlazeId = async (
  db: SQLiteDatabase,
  glazeId: string,
): Promise<PotteryItem[] | null> => {
  const query = `
    SELECT p.*
    FROM PotteryItems p
    INNER JOIN ${POTTERY_ITEM_GLAZES_TABLE} pg ON p.potteryItemId = pg.potteryItemId
    WHERE pg.glazeId = ?;
  `
  const result = await db.getAllAsync(query, [glazeId])
  return result ? (result as PotteryItem[]) : null
}

export const getAllPotteryItemGlazeLinks = async (
  db: SQLiteDatabase,
): Promise<PotteryItemGlazes[] | null> => {
  const query = `
    SELECT * FROM ${POTTERY_ITEM_GLAZES_TABLE};
  `
  const result = await db.getAllAsync(query)
  return result ? (result as PotteryItemGlazes[]) : null // Returns all links between PotteryItems and Glazes
}

export const deletePotteryItemGlazeTable = async (db: SQLiteDatabase): Promise<void> => {
  const deleteTableQuery = `
    DROP TABLE IF EXISTS ${POTTERY_ITEM_GLAZES_TABLE};
  `
  await db.execAsync(deleteTableQuery)
}

export const resetPotteryItemGlazesTable = async (db: SQLiteDatabase) => {
  try {
    await deletePotteryItemGlazeTable(db)
    await createPotteryItemGlazesTable(db)
    console.log('potteryItemGlazes table reset successfully.')
  } catch (error) {
    console.error('Error resetting the potteryItemGlazes table:', error)
    throw error
  }
}
