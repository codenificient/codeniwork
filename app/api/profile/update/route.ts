import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import bcrypt from 'bcrypt'

// Validation schema for profile updates
const updateProfileSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
	image: z.string().url('Invalid image URL').optional(),
	currentPassword: z.string().optional(),
	newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
})

export async function PUT(request: NextRequest) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Parse and validate the request body
		const body = await request.json()
		const validatedData = updateProfileSchema.parse(body)

		// Get current user data
		const currentUser = await db
			.select()
			.from(users)
			.where(eq(users.id, session.user.id))
			.limit(1)

		if (currentUser.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		const user = currentUser[0]

		// Prepare update data
		const updateData: any = {
			name: validatedData.name,
			updatedAt: new Date(),
		}

		// Handle image update
		if (validatedData.image) {
			updateData.image = validatedData.image
		}

		// Handle password update if provided
		if (validatedData.newPassword && validatedData.currentPassword) {
			// Verify current password
			if (!user.passwordHash) {
				return NextResponse.json(
					{ error: 'Password change not allowed for this account type' },
					{ status: 400 }
				)
			}

			const isCurrentPasswordValid = await bcrypt.compare(
				validatedData.currentPassword,
				user.passwordHash
			)

			if (!isCurrentPasswordValid) {
				return NextResponse.json(
					{ error: 'Current password is incorrect' },
					{ status: 400 }
				)
			}

			// Hash new password
			const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 12)
			updateData.passwordHash = newPasswordHash
		}

		// Update the user
		const [updatedUser] = await db
			.update(users)
			.set(updateData)
			.where(eq(users.id, session.user.id))
			.returning({
				id: users.id,
				name: users.name,
				email: users.email,
				image: users.image,
				createdAt: users.createdAt,
				updatedAt: users.updatedAt,
			})

		if (!updatedUser) {
			return NextResponse.json(
				{ error: 'Failed to update user profile' },
				{ status: 500 }
			)
		}

		return NextResponse.json(updatedUser)
	} catch (error) {
		console.error('Error updating user profile:', error)

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
