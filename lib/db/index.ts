import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

// Switched from `@neondatabase/serverless` (Neon HTTP driver) to
// drizzle-orm/node-postgres. Drizzle creates the pg Pool internally
// when given a connection string, which also avoids the dual
// @types/pg hoisting issue between this repo and drizzle-orm itself.

let _db: NodePgDatabase<typeof schema> | null = null

function getDb () {
	if ( !_db ) {
		if ( !process.env.DATABASE_URL ) {
			throw new Error( 'DATABASE_URL environment variable is not set. Please check your .env.local file.' )
		}
		_db=drizzle( process.env.DATABASE_URL,{ schema } )
	}
	return _db
}

export const db = new Proxy( {} as NodePgDatabase<typeof schema>,{
	get ( _target,prop ) {
		return ( getDb() as unknown as Record<string | symbol, unknown> )[ prop ]
	}
} )

export * from './schema'
