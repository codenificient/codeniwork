import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod/v4'

// Validation schema for updating documents
const updateDocumentSchema = z.object({
	name: z.string().min(1, 'Document name is required').max(100, 'Document name too long').optional(),
	type: z.string().min(1, 'Document type is required').optional(),
	format: z.string().min(1, 'Document format is required').optional(),
	size: z.string().optional(),
	fileUrl: z.string().url('Invalid file URL').optional(),
	publicId: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	version: z.string().optional(),
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

		const { id: documentId } = await params

		if (!documentId) {
			return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
		}

		// Check if the document exists and belongs to the user
		const existingDocument = await db
			.select()
			.from(documents)
			.where(
				and(
					eq(documents.id, documentId),
					eq(documents.userId, session.user.id)
				)
			)
			.limit(1)

		if (existingDocument.length === 0) {
			return NextResponse.json(
				{ error: 'Document not found or access denied' },
				{ status: 404 }
			)
		}

		// Parse and validate the request body
		const body = await request.json()
		const validatedData = updateDocumentSchema.parse(body)

		// Update the document
		const [updatedDocument] = await db
			.update(documents)
			.set({
				...validatedData,
				updatedAt: new Date(),
			})
			.where(eq(documents.id, documentId))
			.returning()

		if (!updatedDocument) {
			return NextResponse.json(
				{ error: 'Failed to update document' },
				{ status: 500 }
			)
		}

		return NextResponse.json(updatedDocument)
	} catch (error) {
		console.error('Error updating document:', error)

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

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id: documentId } = await params

		if (!documentId) {
			return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
		}

		// Check if the document exists and belongs to the user
		const existingDocument = await db
			.select()
			.from(documents)
			.where(
				and(
					eq(documents.id, documentId),
					eq(documents.userId, session.user.id)
				)
			)
			.limit(1)

		if (existingDocument.length === 0) {
			return NextResponse.json(
				{ error: 'Document not found or access denied' },
				{ status: 404 }
			)
		}

		// Delete the document
		await db
			.delete(documents)
			.where(eq(documents.id, documentId))

		return NextResponse.json({ message: 'Document deleted successfully' })
	} catch (error) {
		console.error('Error deleting document:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
