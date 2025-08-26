import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getJobApplications } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
	try {
		const session = await auth()
		
		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const applications = await getJobApplications(session.user.id)
		
		return NextResponse.json(applications)
	} catch (error) {
		console.error('Error fetching job applications:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch job applications' },
			{ status: 500 }
		)
	}
}
