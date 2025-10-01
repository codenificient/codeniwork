import { auth } from '@/lib/auth'
import { verifyRegistrationResponse } from '@/lib/passkey-auth'
import { NextRequest,NextResponse } from 'next/server'

export async function POST ( request: NextRequest ) {
	try {
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const credential=await request.json()
		const challenge=request.cookies.get( 'passkey-challenge' )?.value

		if ( !challenge ) {
			return NextResponse.json( { error: 'No challenge found' },{ status: 400 } )
		}

		const verification=await verifyRegistrationResponse(
			credential,
			challenge,
			session.user.id
		)

		if ( verification.verified ) {
			// Clear the challenge cookie
			const response=NextResponse.json( {
				verified: true,
				credentialId: verification.credentialId
			} )
			response.cookies.delete( 'passkey-challenge' )
			return response
		} else {
			return NextResponse.json( { error: 'Verification failed' },{ status: 400 } )
		}
	} catch ( error ) {
		console.error( 'Error verifying registration:',error )
		return NextResponse.json(
			{ error: 'Failed to verify registration' },
			{ status: 500 }
		)
	}
}


