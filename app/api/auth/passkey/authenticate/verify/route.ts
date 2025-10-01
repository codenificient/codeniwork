import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { verifyAuthenticationResponse } from '@/lib/passkey-auth'
import { eq } from 'drizzle-orm'
import { NextRequest,NextResponse } from 'next/server'

export async function POST ( request: NextRequest ) {
	try {
		const credential=await request.json()
		const challenge=request.cookies.get( 'passkey-auth-challenge' )?.value

		if ( !challenge ) {
			return NextResponse.json( { error: 'No challenge found' },{ status: 400 } )
		}

		const verification=await verifyAuthenticationResponse( credential,challenge )

		if ( verification.verified&&verification.userId ) {
			// Get user details
			const user=await db
				.select()
				.from( users )
				.where( eq( users.id,verification.userId ) )
				.limit( 1 )

			if ( user.length===0 ) {
				return NextResponse.json( { error: 'User not found' },{ status: 404 } )
			}

			// Clear the challenge cookie
			const response=NextResponse.json( {
				verified: true,
				user: {
					id: user[ 0 ].id,
					email: user[ 0 ].email,
					name: user[ 0 ].name,
					image: user[ 0 ].image,
				}
			} )
			response.cookies.delete( 'passkey-auth-challenge' )

			return response
		} else {
			return NextResponse.json( { error: 'Authentication failed' },{ status: 400 } )
		}
	} catch ( error ) {
		console.error( 'Error verifying authentication:',error )
		return NextResponse.json(
			{ error: 'Failed to verify authentication' },
			{ status: 500 }
		)
	}
}


