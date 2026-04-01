import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createActivityEvent } from '@/lib/db/queries'
import { companies,externalJobs,jobApplications,savedJobs } from '@/lib/db/schema'
import { and,eq } from 'drizzle-orm'
import { NextRequest,NextResponse } from 'next/server'

// Save/bookmark a job
export async function POST ( request: NextRequest ) {
	try {
		const session=await auth()
		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const body=await request.json()
		const { jobId,action }=body

		if ( !jobId ) {
			return NextResponse.json( { error: 'Job ID is required' },{ status: 400 } )
		}

		if ( action==='unsave' ) {
			await db.delete( savedJobs ).where(
				and( eq( savedJobs.userId,session.user.id ),eq( savedJobs.externalJobId,jobId ) )
			)
			return NextResponse.json( { saved: false } )
		}

		// Save the job
		const existing=await db.select( { id: savedJobs.id } ).from( savedJobs )
			.where( and( eq( savedJobs.userId,session.user.id ),eq( savedJobs.externalJobId,jobId ) ) )
			.limit( 1 )

		if ( existing.length===0 ) {
			await db.insert( savedJobs ).values( {
				userId: session.user.id,
				externalJobId: jobId,
			} )
		}

		return NextResponse.json( { saved: true } )
	} catch ( error ) {
		console.error( 'Error saving job:',error )
		return NextResponse.json( { error: 'Failed to save job' },{ status: 500 } )
	}
}

// Quick apply — create application from external job
export async function PUT ( request: NextRequest ) {
	try {
		const session=await auth()
		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const body=await request.json()
		const { jobId }=body

		if ( !jobId ) {
			return NextResponse.json( { error: 'Job ID is required' },{ status: 400 } )
		}

		// Get the external job
		const [ job ]=await db.select().from( externalJobs ).where( eq( externalJobs.id,jobId ) ).limit( 1 )
		if ( !job ) {
			return NextResponse.json( { error: 'Job not found' },{ status: 404 } )
		}

		// Find or create company
		let companyId: string
		const existingCompany=await db.select().from( companies )
			.where( eq( companies.name,job.company ) ).limit( 1 )

		if ( existingCompany.length===0 ) {
			const [ newCompany ]=await db.insert( companies ).values( {
				name: job.company,
				logo: job.companyLogo||null,
			} ).returning()
			companyId=newCompany.id
		} else {
			companyId=existingCompany[ 0 ].id
		}

		// Create job application
		const salary=job.salaryMin&&job.salaryMax
			? `${job.salaryCurrency||'USD'} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
			: job.salaryMin
				? `${job.salaryCurrency||'USD'} ${job.salaryMin.toLocaleString()}+`
				: null

		const [ newApplication ]=await db.insert( jobApplications ).values( {
			userId: session.user.id,
			companyId,
			position: job.title,
			status: 'applied',
			priority: 'medium',
			salary,
			location: job.location||'Remote',
			jobUrl: job.url,
			isRemote: job.isRemote||false,
			appliedAt: new Date(),
		} ).returning()

		await createActivityEvent(
			newApplication.id,
			'application_created',
			`Applied to ${job.title} at ${job.company}`,
			`Quick applied from Discover page — source: ${job.source}`
		)

		return NextResponse.json( { application: newApplication } )
	} catch ( error ) {
		console.error( 'Error quick applying:',error )
		return NextResponse.json( { error: 'Failed to create application' },{ status: 500 } )
	}
}
