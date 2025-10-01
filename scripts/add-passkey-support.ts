import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

async function addPasskeySupport () {
	console.log( 'Adding passkey support to database...' )

	try {
		// Add new columns to users table
		await db.execute( sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS master_password_hash TEXT,
      ADD COLUMN IF NOT EXISTS master_password_salt TEXT,
      ADD COLUMN IF NOT EXISTS encryption_key_derivation_salt TEXT
    `)

		// Create passkey_credentials table
		await db.execute( sql`
      CREATE TABLE IF NOT EXISTS passkey_credentials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        credential_id TEXT NOT NULL UNIQUE,
        public_key TEXT NOT NULL,
        counter TEXT NOT NULL DEFAULT '0',
        device_type TEXT,
        backed_up BOOLEAN DEFAULT false,
        transports TEXT,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        last_used TIMESTAMP
      )
    `)

		console.log( '✅ Successfully added passkey support to database' )
	} catch ( error ) {
		console.error( '❌ Error adding passkey support:',error )
		process.exit( 1 )
	}
}

// Run the migration
addPasskeySupport()
	.then( () => {
		console.log( 'Migration completed successfully' )
		process.exit( 0 )
	} )
	.catch( ( error ) => {
		console.error( 'Migration failed:',error )
		process.exit( 1 )
	} )


