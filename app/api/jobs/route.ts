import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { externalJobs,savedJobs } from '@/lib/db/schema'
import { and,desc,eq,ilike,or,sql } from 'drizzle-orm'
import { NextRequest,NextResponse } from 'next/server'

export async function GET ( request: NextRequest ) {
	try {
		const session=await auth()
		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const searchParams=request.nextUrl.searchParams
		const search=searchParams.get( 'search' )||''
		const source=searchParams.get( 'source' )||''
		const remote=searchParams.get( 'remote' )
		const page=parseInt( searchParams.get( 'page' )||'1' )
		const limit=parseInt( searchParams.get( 'limit' )||'20' )
		const offset=( page-1 )*limit

		// Build conditions
		const conditions=[]
		if ( search ) {
			conditions.push( or(
				ilike( externalJobs.title,`%${search}%` ),
				ilike( externalJobs.company,`%${search}%` ),
			) )
		}
		if ( source ) {
			conditions.push( eq( externalJobs.source,source ) )
		}
		if ( remote==='true' ) {
			conditions.push( eq( externalJobs.isRemote,true ) )
		}

		const where=conditions.length>0? and( ...conditions ):undefined

		// Fetch jobs with saved status
		const jobs=await db
			.select( {
				id: externalJobs.id,
				title: externalJobs.title,
				company: externalJobs.company,
				companyLogo: externalJobs.companyLogo,
				url: externalJobs.url,
				source: externalJobs.source,
				description: externalJobs.description,
				salaryMin: externalJobs.salaryMin,
				salaryMax: externalJobs.salaryMax,
				salaryCurrency: externalJobs.salaryCurrency,
				location: externalJobs.location,
				isRemote: externalJobs.isRemote,
				tags: externalJobs.tags,
				postedAt: externalJobs.postedAt,
				fetchedAt: externalJobs.fetchedAt,
				savedJobId: savedJobs.id,
			} )
			.from( externalJobs )
			.leftJoin( savedJobs,and(
				eq( savedJobs.externalJobId,externalJobs.id ),
				eq( savedJobs.userId,session.user.id )
			) )
			.where( where )
			.orderBy( desc( externalJobs.fetchedAt ) )
			.limit( limit )
			.offset( offset )

		// Get total count
		const [ countResult ]=await db
			.select( { count: sql<number>`count(*)` } )
			.from( externalJobs )
			.where( where )

		return NextResponse.json( {
			jobs: jobs.map( ( j ) => ( { ...j,isSaved: !!j.savedJobId } ) ),
			total: Number( countResult.count ),
			page,
			totalPages: Math.ceil( Number( countResult.count )/limit ),
		} )
	} catch ( error ) {
		console.error( 'Error listing jobs:',error )
		return NextResponse.json( { error: 'Failed to list jobs' },{ status: 500 } )
	}
}
