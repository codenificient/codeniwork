import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { companies,jobApplications } from '@/lib/db/schema'
import { and,eq } from 'drizzle-orm'
import { NextRequest,NextResponse } from 'next/server'
import { z } from 'zod/v4'

// Validation schema for updating companies
const updateCompanySchema=z.object( {
	name: z.string().min( 1,'Company name is required' ).max( 100,'Company name too long' ),
	website: z.string().url( 'Please enter a valid URL' ).optional().or( z.literal( '' ) ),
	description: z.string().optional(),
	location: z.string().optional(),
	industry: z.string().optional(),
	size: z.string().optional(),
	logo: z.string().url( 'Invalid logo URL' ).optional(),
} )

export async function PUT (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Get the authenticated user session
		const session=await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' },{ status: 401 } )
		}

		const { id: companyId }=await params

		if ( !companyId ) {
			return NextResponse.json( { error: 'Company ID is required' },{ status: 400 } )
		}

		// Check if the company exists and has applications by the user
		const existingCompany=await db
			.select()
			.from( companies )
			.innerJoin( jobApplications,eq( companies.id,jobApplications.companyId ) )
			.where(
				and(
					eq( companies.id,companyId ),
					eq( jobApplications.userId,session.user.id )
				)
			)
			.limit( 1 )

		if ( existingCompany.length===0 ) {
			return NextResponse.json(
				{ error: 'Company not found or access denied' },
				{ status: 404 }
			)
		}

		// Parse and validate the request body
		const body=await request.json()
		const validatedData=updateCompanySchema.parse( body )

		// Update the company
		const [ updatedCompany ]=await db
			.update( companies )
			.set( {
				name: validatedData.name,
				website: validatedData.website||null,
				description: validatedData.description||null,
				location: validatedData.location||null,
				industry: validatedData.industry||null,
				size: validatedData.size||null,
				logo: validatedData.logo||null,
				updatedAt: new Date(),
			} )
			.where( eq( companies.id,companyId ) )
			.returning()

		if ( !updatedCompany ) {
			return NextResponse.json(
				{ error: 'Failed to update company' },
				{ status: 500 }
			)
		}

		return NextResponse.json( updatedCompany )
	} catch ( error ) {
		console.error( 'Error updating company:',error )

		if ( error instanceof z.ZodError ) {
			return NextResponse.json(
				{ error: 'Validation error',details: error.issues },
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
