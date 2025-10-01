import { auth } from '@/lib/auth'
import { generateRegistrationOptions } from '@/lib/passkey-auth'
import { NextRequest,NextResponse } from 'next/server'

export async function POST ( request: NextRequest ) {
	try {
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const { userName,userDisplayName }=await request.json()

		const options=await generateRegistrationOptions(
			session.user.id,
			userName||session.user.email||'User',
			userDisplayName||session.user.name||'User'
		)

		// Store challenge in session or temporary storage
		// For production, you'd want to store this in Redis or similar
		const response=NextResponse.json( options )
		response.cookies.set( 'passkey-challenge',options.challenge,{
			httpOnly: true,
			secure: process.env.NODE_ENV==='production',
			sameSite: 'strict',
			maxAge: 300, // 5 minutes
		} )

		return response
	} catch ( error ) {
		console.error( 'Error generating registration options:',error )
		return NextResponse.json(
			{ error: 'Failed to generate registration options' },
			{ status: 500 }
		)
	}
}


