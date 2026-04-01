import { auth } from '@/lib/auth'
import { fetchAllJobs } from '@/lib/job-fetcher'
import { NextResponse } from 'next/server'

export async function POST () {
	try {
		const session=await auth()
		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const result=await fetchAllJobs()
		return NextResponse.json( result )
	} catch ( error ) {
		console.error( 'Error fetching jobs:',error )
		return NextResponse.json( { error: 'Failed to fetch jobs' },{ status: 500 } )
	}
}
