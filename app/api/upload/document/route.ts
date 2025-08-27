import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Parse the form data
		const formData = await request.formData()
		const file = formData.get('file') as File
		const documentType = formData.get('documentType') as string

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		if (!documentType) {
			return NextResponse.json({ error: 'Document type is required' }, { status: 400 })
		}

		// Validate file type (allow common document formats)
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'text/plain',
			'image/jpeg',
			'image/png',
			'image/gif'
		]

		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json({ 
				error: 'Invalid file type. Allowed types: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF' 
			}, { status: 400 })
		}

		// Validate file size (max 10MB for documents)
		if (file.size > 10 * 1024 * 1024) {
			return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
		}

		// Convert file to buffer
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		// Convert buffer to base64 string
		const base64String = `data:${file.type};base64,${buffer.toString('base64')}`

		// Determine resource type based on file type
		const resourceType = file.type.startsWith('image/') ? 'image' : 'raw'

		// Upload to Cloudinary
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				base64String,
				{
					folder: `codeniwork/documents/${documentType.toLowerCase()}`,
					resource_type: resourceType,
					public_id: `${documentType.toLowerCase()}_${session.user!.id}_${Date.now()}`,
					// For documents, we don't apply transformations to preserve original format
				},
				(error, result) => {
					if (error) {
						reject(error)
					} else {
						resolve(result)
					}
				}
			)
		})

		// Return the secure URL and file info
		return NextResponse.json({
			secure_url: (result as any).secure_url,
			public_id: (result as any).public_id,
			format: (result as any).format,
			bytes: (result as any).bytes,
			message: 'Document uploaded successfully'
		})

	} catch (error) {
		console.error('Error uploading document:', error)
		
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message },
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{ error: 'Internal server error during document upload' },
			{ status: 500 }
		)
	}
}
