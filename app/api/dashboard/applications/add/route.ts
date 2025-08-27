import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { companies, jobApplications } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createActivityEvent } from '@/lib/db/queries'

// Validation schema for adding job applications
const addApplicationSchema = z.object({
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

export async function POST(request: NextRequest) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Parse and validate the request body
		const body = await request.json()
		const validatedData = addApplicationSchema.parse(body)

		// Check if company exists, if not create it
		let companyId: string
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

		// Create the job application
		const [newApplication] = await db
			.insert(jobApplications)
			.values({
				userId: session.user.id,
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
				appliedAt: new Date(),
			})
			.returning()

		if (!newApplication) {
			return NextResponse.json(
				{ error: 'Failed to create application' },
				{ status: 500 }
			)
		}

		// Create activity event for the new application
		await createActivityEvent(
			newApplication.id,
			'application_created',
			`Applied to ${validatedData.position} at ${validatedData.companyName}`,
			`New job application submitted for ${validatedData.position} position at ${validatedData.companyName}`
		)

		// Return the created application with company details
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
			.where(eq(jobApplications.id, newApplication.id))
			.limit(1)

		return NextResponse.json(result[0])
	} catch (error) {
		console.error('Error creating job application:', error)

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
