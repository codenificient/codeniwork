import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json()

		// Validate input
		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 }
			)
		}

		// Find user by email
		const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1)
		
		if (userResult.length === 0) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		const user = userResult[0]

		// Check if user has password hash
		if (!user.passwordHash) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
		
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Return user data (without password hash)
		const { passwordHash: _, ...userWithoutPassword } = user
		
		return NextResponse.json({
			message: 'Authentication successful',
			user: userWithoutPassword
		})

	} catch (error) {
		console.error('Signin error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
