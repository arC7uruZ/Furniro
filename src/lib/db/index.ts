import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { category, productTable, type } from '$lib/db/schema';
import { faker } from '@faker-js/faker';

export const db = drizzle(process.env.DB_FILE_NAME!);
export const dbType = typeof db;