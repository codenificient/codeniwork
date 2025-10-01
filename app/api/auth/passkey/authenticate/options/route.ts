import { generateAuthenticationOptions } from '@/lib/passkey-auth'
import { NextRequest,NextResponse } from 'next/server'

export async function POST ( request: NextRequest ) {
	try {
		const { userId }=await request.json()

		const options=await generateAuthenticationOptions( userId )

		// Store challenge in cookie
		const response=NextResponse.json( options )
		response.cookies.set( 'passkey-auth-challenge',options.challenge,{
			httpOnly: true,
			secure: process.env.NODE_ENV==='production',
			sameSite: 'strict',
			maxAge: 300, // 5 minutes
		} )

		return response
	} catch ( error ) {
		console.error( 'Error generating authentication options:',error )
		return NextResponse.json(
			{ error: 'Failed to generate authentication options' },
			{ status: 500 }
		)
	}
}


