import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import * as schema from './schema';

const DB_PATH        = process.env.DB_PATH || path.join(process.cwd(), 'data.db');
const MIGRATIONS_DIR = path.join(process.cwd(), 'drizzle');

const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

// Apply pending migrations on every startup
migrate(db, { migrationsFolder: MIGRATIONS_DIR });
