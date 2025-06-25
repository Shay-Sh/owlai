import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Allow builds without database connection
const connectionString = process.env.POSTGRES_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';

export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
