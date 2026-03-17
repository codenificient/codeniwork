import { auth } from '@/lib/auth'
import { autoRejectOldApplications } from '@/lib/db/queries'
import { NextRequest,NextResponse } from 'next/server'

export async function POST ( request: NextRequest ) {
	try {
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		// Scope auto-rejection to the authenticated user
		const result=await autoRejectOldApplications( session.user.id )

		return NextResponse.json( {
			success: true,
			message: `Successfully processed ${result.rejectedCount} applications`,
			rejectedCount: result.rejectedCount,
			applications: result.applications
		} )
	} catch ( error ) {
		console.error( 'Error in auto-rejection process:',error )
		return NextResponse.json(
			{
				error: 'Failed to process auto-rejection',
				details: error instanceof Error? error.message:'Unknown error'
			},
			{ status: 500 }
		)
	}
}

// GET is used by Vercel cron — verifies CRON_SECRET or falls back to session auth
export async function GET ( request: NextRequest ) {
	try {
		const authHeader=request.headers.get( 'authorization' )
		const cronSecret=process.env.CRON_SECRET

		// Vercel cron sends Authorization: Bearer <CRON_SECRET>
		if ( cronSecret && authHeader === `Bearer ${cronSecret}` ) {
			const result=await autoRejectOldApplications()

			return NextResponse.json( {
				success: true,
				message: `Found ${result.rejectedCount} applications to reject`,
				rejectedCount: result.rejectedCount,
				applications: result.applications
			} )
		}

		// Fallback: user-triggered via session
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const result=await autoRejectOldApplications( session.user.id )

		return NextResponse.json( {
			success: true,
			message: `Found ${result.rejectedCount} applications to reject`,
			rejectedCount: result.rejectedCount,
			applications: result.applications
		} )
	} catch ( error ) {
		console.error( 'Error in auto-rejection process:',error )
		return NextResponse.json(
			{
				error: 'Failed to process auto-rejection',
				details: error instanceof Error? error.message:'Unknown error'
			},
			{ status: 500 }
		)
	}
}
