import { auth } from '@/lib/auth'
import { getRecentActivity } from '@/lib/db/queries'
import { NextRequest,NextResponse } from 'next/server'

export async function GET ( request: NextRequest ) {
	try {
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const limit=request.nextUrl.searchParams.get( 'limit' )||'5'
		const activity=await getRecentActivity( session.user.id,parseInt( limit ) )

		return NextResponse.json( activity )
	} catch ( error ) {
		console.error( 'Error fetching recent activity:',error )
		return NextResponse.json(
			{ error: 'Failed to fetch recent activity' },
			{ status: 500 }
		)
	}
}
