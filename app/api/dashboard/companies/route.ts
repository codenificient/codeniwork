import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { companies, jobApplications } from '@/lib/db/schema'
import { eq, count, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get companies with job application counts for the user
		const companiesWithCounts = await db
			.select({
				id: companies.id,
				name: companies.name,
				website: companies.website,
				logo: companies.logo,
				description: companies.description,
				location: companies.location,
				industry: companies.industry,
				size: companies.size,
				createdAt: companies.createdAt,
				updatedAt: companies.updatedAt,
				applicationsCount: count(jobApplications.id).as('applicationsCount'),
			})
			.from(companies)
			.leftJoin(
				jobApplications,
				eq(companies.id, jobApplications.companyId)
			)
			.where(eq(jobApplications.userId, session.user.id))
			.groupBy(
				companies.id,
				companies.name,
				companies.website,
				companies.logo,
				companies.description,
				companies.location,
				companies.industry,
				companies.size,
				companies.createdAt,
				companies.updatedAt
			)
			.orderBy(desc(companies.updatedAt))

		return NextResponse.json(companiesWithCounts)
	} catch (error) {
		console.error('Error fetching companies:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
