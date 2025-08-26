import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
	try {
		const { email, password, name } = await request.json()

		// Validate input
		if (!email || !password || !name) {
			return NextResponse.json(
				{ error: 'Email, password, and name are required' },
				{ status: 400 }
			)
		}

		// Check if user already exists
		const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
		
		if (existingUser.length > 0) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 409 }
			)
		}

		// Hash password
		const saltRounds = 12
		const passwordHash = await bcrypt.hash(password, saltRounds)

		// Create new user
		const newUser = await db.insert(users).values({
			email,
			name,
			passwordHash,
			emailVerified: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		}).returning()

		// Return success (don't return password hash)
		const { passwordHash: _, ...userWithoutPassword } = newUser[0]
		
		return NextResponse.json({
			message: 'User created successfully',
			user: userWithoutPassword
		}, { status: 201 })

	} catch (error) {
		console.error('Signup error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
