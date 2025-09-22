import { auth } from '@/lib/auth'
import { autoRejectOldApplications } from '@/lib/db/queries'
import { NextRequest,NextResponse } from 'next/server'

export async function POST ( request: NextRequest ) {
	try {
		// Get the authenticated user session
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		// Run the auto-rejection process
		const result=await autoRejectOldApplications()

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

// Also allow GET for testing purposes
export async function GET ( request: NextRequest ) {
	try {
		// Get the authenticated user session
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		// Run the auto-rejection process
		const result=await autoRejectOldApplications()

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
