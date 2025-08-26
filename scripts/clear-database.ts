import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { accounts,applicationEvents,companies,jobApplications,sessions,users,verificationTokens } from '../lib/db/schema'

// Database connection
const sql=neon( process.env.DATABASE_URL! )
const db=drizzle( sql )

async function clearDatabase () {
	console.log( '🧹 Starting database cleanup...' )

	try {
		// Clear all tables in the correct order (respecting foreign key constraints)
		console.log( '🗑️ Clearing application events...' )
		await db.delete( applicationEvents )

		console.log( '🗑️ Clearing job applications...' )
		await db.delete( jobApplications )

		console.log( '🗑️ Clearing companies...' )
		await db.delete( companies )

		console.log( '🗑️ Clearing verification tokens...' )
		await db.delete( verificationTokens )

		console.log( '🗑️ Clearing accounts...' )
		await db.delete( accounts )

		console.log( '🗑️ Clearing sessions...' )
		await db.delete( sessions )

		console.log( '🗑️ Clearing users...' )
		await db.delete( users )

		console.log( '✅ Database cleared successfully!' )
		console.log( '📊 All tables have been emptied and are ready for reseeding.' )

	} catch ( error ) {
		console.error( '❌ Error clearing database:',error )
		process.exit( 1 )
	}
}

// Run the cleanup function
clearDatabase()
