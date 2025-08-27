import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { jobApplications, companies } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

// Validation schema for updating job applications
const updateApplicationSchema = z.object({
	companyName: z.string().min(1, 'Company name is required'),
	position: z.string().min(1, 'Position is required'),
	jobUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	location: z.string().min(1, 'Location is required'),
	salary: z.string().optional(),
	notes: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']),
	isRemote: z.boolean().default(false),
	status: z.enum(['applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn']),
	deadline: z.string().optional(),
})

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id: applicationId } = await params

		if (!applicationId) {
			return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
		}

		// Parse and validate the request body
		const body = await request.json()
		const validatedData = updateApplicationSchema.parse(body)

		// First, check if the application exists and belongs to the user
		const existingApplication = await db
			.select()
			.from(jobApplications)
			.where(
				and(
					eq(jobApplications.id, applicationId),
					eq(jobApplications.userId, session.user.id)
				)
			)
			.limit(1)

		if (existingApplication.length === 0) {
			return NextResponse.json(
				{ error: 'Application not found or access denied' },
				{ status: 404 }
			)
		}

		const currentApp = existingApplication[0]

		// Check if company exists, if not create it
		let companyId = currentApp.companyId
		const existingCompany = await db
			.select()
			.from(companies)
			.where(eq(companies.name, validatedData.companyName))
			.limit(1)

		if (existingCompany.length === 0) {
			// Create new company
			const [newCompany] = await db
				.insert(companies)
				.values({
					name: validatedData.companyName,
					website: validatedData.jobUrl || null,
				})
				.returning()

			companyId = newCompany.id
		} else {
			companyId = existingCompany[0].id
		}

		// Prepare deadline date
		let deadlineDate = null
		if (validatedData.deadline) {
			deadlineDate = new Date(validatedData.deadline)
			if (isNaN(deadlineDate.getTime())) {
				return NextResponse.json(
					{ error: 'Invalid deadline date format' },
					{ status: 400 }
				)
			}
		}

		// Update the job application
		const [updatedApplication] = await db
			.update(jobApplications)
			.set({
				companyId: companyId,
				position: validatedData.position,
				status: validatedData.status,
				priority: validatedData.priority,
				salary: validatedData.salary || null,
				location: validatedData.location,
				jobUrl: validatedData.jobUrl || null,
				notes: validatedData.notes || null,
				isRemote: validatedData.isRemote,
				deadline: deadlineDate,
				updatedAt: new Date(),
			})
			.where(eq(jobApplications.id, applicationId))
			.returning()

		if (!updatedApplication) {
			return NextResponse.json(
				{ error: 'Failed to update application' },
				{ status: 500 }
			)
		}

		// Return the updated application with company details
		const result = await db
			.select({
				id: jobApplications.id,
				position: jobApplications.position,
				status: jobApplications.status,
				priority: jobApplications.priority,
				salary: jobApplications.salary,
				location: jobApplications.location,
				jobUrl: jobApplications.jobUrl,
				notes: jobApplications.notes,
				appliedAt: jobApplications.appliedAt,
				deadline: jobApplications.deadline,
				isRemote: jobApplications.isRemote,
				company: {
					id: companies.id,
					name: companies.name,
					logo: companies.logo,
					website: companies.website,
				},
			})
			.from(jobApplications)
			.innerJoin(companies, eq(jobApplications.companyId, companies.id))
			.where(eq(jobApplications.id, applicationId))
			.limit(1)

		return NextResponse.json(result[0])
	} catch (error) {
		console.error('Error updating job application:', error)

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Validation error', details: error.errors },
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
