import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { passkeyCredentials } from '@/lib/db/schema'
import { and,eq } from 'drizzle-orm'
import { NextRequest,NextResponse } from 'next/server'

export async function DELETE (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const { id: passkeyId }=await params

		// Delete the passkey (only if it belongs to the current user)
		const result=await db
			.delete( passkeyCredentials )
			.where(
				and(
					eq( passkeyCredentials.id,passkeyId ),
					eq( passkeyCredentials.userId,session.user.id )
				)
			)
			.returning()

		if ( result.length===0 ) {
			return NextResponse.json(
				{ error: 'Passkey not found or unauthorized' },
				{ status: 404 }
			)
		}

		return NextResponse.json( { success: true } )
	} catch ( error ) {
		console.error( 'Error deleting passkey:',error )
		return NextResponse.json(
			{ error: 'Failed to delete passkey' },
			{ status: 500 }
		)
	}
}


