import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDashboardStats } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
	try {
		const session = await auth()
		
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const stats = await getDashboardStats(session.user.id)
		
		return NextResponse.json(stats)
	} catch (error) {
		console.error('Error fetching dashboard stats:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch dashboard stats' },
			{ status: 500 }
		)
	}
}
