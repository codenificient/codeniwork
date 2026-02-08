import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod/v4'

// Validation schema for creating documents
const createDocumentSchema = z.object({
	name: z.string().min(1, 'Document name is required').max(100, 'Document name too long'),
	type: z.string().min(1, 'Document type is required'),
	format: z.string().min(1, 'Document format is required'),
	size: z.string().optional(),
	fileUrl: z.string().url('Invalid file URL').min(1, 'File URL is required'),
	publicId: z.string().optional(),
	description: z.string().optional(),
	status: z.string().default('active'),
	version: z.string().default('v1.0'),
})

export async function GET(request: NextRequest) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get all documents for the user
		const userDocuments = await db
			.select()
			.from(documents)
			.where(eq(documents.userId, session.user.id))
			.orderBy(desc(documents.updatedAt))

		return NextResponse.json(userDocuments)
	} catch (error) {
		console.error('Error fetching documents:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Parse and validate the request body
		const body = await request.json()
		const validatedData = createDocumentSchema.parse(body)

		// Create the document
		const [newDocument] = await db
			.insert(documents)
			.values({
				userId: session.user.id,
				name: validatedData.name,
				type: validatedData.type,
				format: validatedData.format,
				size: validatedData.size,
				fileUrl: validatedData.fileUrl,
				publicId: validatedData.publicId,
				description: validatedData.description,
				status: validatedData.status,
				version: validatedData.version,
			})
			.returning()

		if (!newDocument) {
			return NextResponse.json(
				{ error: 'Failed to create document' },
				{ status: 500 }
			)
		}

		return NextResponse.json(newDocument, { status: 201 })
	} catch (error) {
		console.error('Error creating document:', error)

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: 'Validation error', details: error.issues },
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
