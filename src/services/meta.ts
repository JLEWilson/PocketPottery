import type { SQLiteDatabase } from 'expo-sqlite'
import { POTTERY_ITEM_TABLE_NAME } from './potteryItem-service';
import { CLAY_TABLE_NAME } from './clay-service';

export const createMetaTable = async (db: SQLiteDatabase) => {
  // Check if meta table exists
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (
      id INTEGER PRIMARY KEY NOT NULL,
      dbVersion INTEGER NOT NULL
    );
  `);

  // Get the current version
  const result = await db.getFirstAsync('SELECT dbVersion FROM meta LIMIT 1;');
  let currentVersion = result ? result as number : 0;

  // Migrate the database
  // console.log(currentVersion)
  if (currentVersion < 2) {
    await migrateToVersion2(db);
    await db.execAsync('INSERT OR REPLACE INTO meta (id, dbVersion) VALUES (1, 2);');
  }
}

async function migrateToVersion2(db: SQLiteDatabase) {
    /*
        Changes for version 2:
        GLAZES
            ID string
            Type string - underglaze or glaze

    */
  await db.execAsync(`
    ALTER TABLE ${POTTERY_ITEM_TABLE_NAME} ADD COLUMN series TEXT;
    ALTER TABLE ${CLAY_TABLE_NAME} ADD COLUMN type TEXT;
    ALTER TABLE ${CLAY_TABLE_NAME} ADD COLUMN firingRange TEXT
  `);
}

const deleteMetaTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS meta`
  await db.execAsync(query)
}

export const resetMetaTable = async (db: SQLiteDatabase) => {
  try {
    await deleteMetaTable(db)
    await createMetaTable(db)
  } catch (error) {
    console.error(error)
  }
}