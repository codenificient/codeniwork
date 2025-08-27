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
		const companyId = formData.get('companyId') as string

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		if (!companyId) {
			return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
		}

		// Convert file to buffer
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		// Convert buffer to base64 string
		const base64String = `data:${file.type};base64,${buffer.toString('base64')}`

		// Upload to Cloudinary
		const result = await new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				base64String,
				{
					folder: 'codeniwork/companies',
					resource_type: 'image',
					transformation: [
						{ width: 200, height: 200, crop: 'fill', gravity: 'center' },
						{ quality: 'auto:good' }
					],
					public_id: `company_${companyId}_${Date.now()}`,
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

		// Return the secure URL
		return NextResponse.json({
			secure_url: (result as any).secure_url,
			public_id: (result as any).public_id,
			message: 'Company logo uploaded successfully'
		})

	} catch (error) {
		console.error('Error uploading company logo:', error)
		
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message },
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{ error: 'Internal server error during logo upload' },
			{ status: 500 }
		)
	}
}
