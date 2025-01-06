import type { SQLiteDatabase } from 'expo-sqlite';
import { POTTERY_ITEM_TABLE_NAME } from './potteryItem-service';
import { CLAY_TABLE_NAME } from './clay-service';
import { GLAZE_TABLE_NAME } from './glaze-service';

export const createMetaTable = async (db: SQLiteDatabase) => {
  try {
    // Check if meta table exists
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS meta (
        id INTEGER PRIMARY KEY NOT NULL,
        dbVersion INTEGER NOT NULL
      );
    `);

    // Get the current version
    const result = await db.getFirstAsync('SELECT dbVersion FROM meta LIMIT 1;');
    let currentVersion = result ? (result as number) : 1;

    // Migrate the database
    if (currentVersion < 2) {
      await migrateToVersion2(db);
      await db.execAsync('INSERT OR REPLACE INTO meta (id, dbVersion) VALUES (1, 2);');
    }

    if (currentVersion < 3) {
      await migrateToVersion3(db);
      await db.execAsync('INSERT OR REPLACE INTO meta (id, dbVersion) VALUES (1, 2);');
    }
  } catch (error) {
    console.error('Error creating meta table or migrating database:', error);
  }
};

async function migrateToVersion2(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      ALTER TABLE ${POTTERY_ITEM_TABLE_NAME} ADD COLUMN series TEXT;
      ALTER TABLE ${CLAY_TABLE_NAME} ADD COLUMN type TEXT;
      ALTER TABLE ${CLAY_TABLE_NAME} ADD COLUMN firingRange TEXT;
      ALTER TABLE ${GLAZE_TABLE_NAME} ADD COLUMN type TEXT;
      ALTER TABLE ${GLAZE_TABLE_NAME} ADD COLUMN idCode TEXT;
    `);
  } catch (error) {
    console.error('Error migrating to version 2:', error);
  }
}

async function migrateToVersion3(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
      ALTER TABLE ${POTTERY_ITEM_TABLE_NAME} ADD COLUMN startDate TEXT;
      ALTER TABLE ${POTTERY_ITEM_TABLE_NAME} ADD COLUMN greenwareDate TEXT;
      ALTER TABLE ${POTTERY_ITEM_TABLE_NAME} ADD COLUMN bisqueDate TEXT;
      ALTER TABLE ${POTTERY_ITEM_TABLE_NAME} ADD COLUMN glazeDate TEXT;
    `);
  } catch (error) {
    console.error('Error migrating to version 3:', error);
  }
}

const deleteMetaTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE IF EXISTS meta`;
  try {
    await db.execAsync(query);
  } catch (error) {
    console.error('Error deleting meta table:', error);
  }
};

export const resetMetaTable = async (db: SQLiteDatabase) => {
  try {
    await deleteMetaTable(db);
    await createMetaTable(db);
  } catch (error) {
    console.error('Error resetting meta table:', error);
  }
};
