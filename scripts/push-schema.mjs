import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './lib/db/schema.ts';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

// Just test connection
const result = await sql`SELECT 1 as test`;
console.log('Connection test:', result);

// Check if tables exist
const tables = await sql`
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name IN ('resume_parses', 'job_matches', 'cover_letters')
`;
console.log('Existing AI tables:', tables);
