import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { passkeyCredentials } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest,NextResponse } from 'next/server'

export async function GET ( request: NextRequest ) {
	try {
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const userPasskeys=await db
			.select( {
				id: passkeyCredentials.id,
				name: passkeyCredentials.name,
				createdAt: passkeyCredentials.createdAt,
				lastUsed: passkeyCredentials.lastUsed,
				deviceType: passkeyCredentials.deviceType,
			} )
			.from( passkeyCredentials )
			.where( eq( passkeyCredentials.userId,session.user.id ) )
			.orderBy( passkeyCredentials.createdAt )

		return NextResponse.json( { passkeys: userPasskeys } )
	} catch ( error ) {
		console.error( 'Error listing passkeys:',error )
		return NextResponse.json(
			{ error: 'Failed to list passkeys' },
			{ status: 500 }
		)
	}
}


