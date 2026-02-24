import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const db = drizzle({ connection: process.env.DB_FILE_NAME!, casing: "snake_case", schema });
export const dbType = typeof db;