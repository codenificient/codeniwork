import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { jobApplications, companies } from '@/lib/db/schema'
import { eq, count, desc, sql, and, gte, lte } from 'drizzle-orm'

export async function GET(request: NextRequest) {
	try {
		// Get the authenticated user session
		const session = await auth()

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const userId = session.user.id

		// Get total applications
		const totalApplications = await db
			.select({ count: count() })
			.from(jobApplications)
			.where(eq(jobApplications.userId, userId))

		// Get applications by status
		const statusCounts = await db
			.select({
				status: jobApplications.status,
				count: count(),
			})
			.from(jobApplications)
			.where(eq(jobApplications.userId, userId))
			.groupBy(jobApplications.status)

		// Calculate response rate (applications with responses)
		const responsesCount = await db
			.select({ count: count() })
			.from(jobApplications)
			.where(
				and(
					eq(jobApplications.userId, userId),
					sql`${jobApplications.status} IN ('interview', 'offer', 'rejected')`
				)
			)

		// Calculate interview rate
		const interviewsCount = await db
			.select({ count: count() })
			.from(jobApplications)
			.where(
				and(
					eq(jobApplications.userId, userId),
					sql`${jobApplications.status} IN ('interview', 'offer')`
				)
			)

		// Calculate offer rate
		const offersCount = await db
			.select({ count: count() })
			.from(jobApplications)
			.where(
				and(
					eq(jobApplications.userId, userId),
					eq(jobApplications.status, 'offer')
				)
			)

		// Get monthly data for the last 6 months
		const sixMonthsAgo = new Date()
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

		const monthlyData = await db
			.select({
				month: sql<string>`TO_CHAR(${jobApplications.createdAt}, 'Mon')`,
				year: sql<number>`EXTRACT(YEAR FROM ${jobApplications.createdAt})`,
				monthNum: sql<number>`EXTRACT(MONTH FROM ${jobApplications.createdAt})`,
				applications: count(),
			})
			.from(jobApplications)
			.where(
				and(
					eq(jobApplications.userId, userId),
					gte(jobApplications.createdAt, sixMonthsAgo)
				)
			)
			.groupBy(
				sql`TO_CHAR(${jobApplications.createdAt}, 'Mon')`,
				sql`EXTRACT(YEAR FROM ${jobApplications.createdAt})`,
				sql`EXTRACT(MONTH FROM ${jobApplications.createdAt})`
			)
			.orderBy(sql`EXTRACT(YEAR FROM ${jobApplications.createdAt})`, sql`EXTRACT(MONTH FROM ${jobApplications.createdAt})`)

		// Get top companies by application count
		const topCompanies = await db
			.select({
				companyId: companies.id,
				companyName: companies.name,
				companyLogo: companies.logo,
				applications: count(),
				responseRate: sql<string>`CASE 
					WHEN COUNT(*) > 0 THEN 
						ROUND(
							(COUNT(CASE WHEN ${jobApplications.status} IN ('interview', 'offer', 'rejected') THEN 1 END) * 100.0 / COUNT(*))
						)::text || '%'
					ELSE '0%'
				END`,
			})
			.from(jobApplications)
			.innerJoin(companies, eq(jobApplications.companyId, companies.id))
			.where(eq(jobApplications.userId, userId))
			.groupBy(companies.id, companies.name, companies.logo)
			.orderBy(desc(count()))
			.limit(5)

		// Calculate trends (comparing current month vs previous month)
		const currentMonth = new Date()
		const previousMonth = new Date()
		previousMonth.setMonth(previousMonth.getMonth() - 1)

		const currentMonthApps = await db
			.select({ count: count() })
			.from(jobApplications)
			.where(
				and(
					eq(jobApplications.userId, userId),
					gte(jobApplications.createdAt, new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)),
					lte(jobApplications.createdAt, new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))
				)
			)

		const previousMonthApps = await db
			.select({ count: count() })
			.from(jobApplications)
			.where(
				and(
					eq(jobApplications.userId, userId),
					gte(jobApplications.createdAt, new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1)),
					lte(jobApplications.createdAt, new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0))
				)
			)

		const totalApps = totalApplications[0]?.count || 0
		const responses = responsesCount[0]?.count || 0
		const interviews = interviewsCount[0]?.count || 0
		const offers = offersCount[0]?.count || 0
		const currentMonthCount = currentMonthApps[0]?.count || 0
		const previousMonthCount = previousMonthApps[0]?.count || 0

		// Calculate percentage changes
		const applicationsChange = previousMonthCount > 0 
			? Math.round(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100)
			: 0

		const responseRateChange = totalApps > 0 
			? Math.round(((responses / totalApps) * 100) - ((responses / totalApps) * 100)) // This will be 0 for now, can be enhanced
			: 0

		const interviewRateChange = totalApps > 0 
			? Math.round(((interviews / totalApps) * 100) - ((interviews / totalApps) * 100)) // This will be 0 for now, can be enhanced
			: 0

		const rejectionRateChange = totalApps > 0 
			? Math.round(((responses / totalApps) * 100) - ((responses / totalApps) * 100)) // This will be 0 for now, can be enhanced
			: 0

		// Format monthly data
		const formattedMonthlyData = monthlyData.map(data => ({
			month: data.month,
			applications: Number(data.applications),
			interviews: 0, // Can be enhanced to track actual interview dates
			offers: 0, // Can be enhanced to track actual offer dates
		}))

		// Prepare response data
		const analyticsData = {
			stats: [
				{
					title: 'Total Applications',
					value: totalApps.toString(),
					change: `${applicationsChange >= 0 ? '+' : ''}${applicationsChange}%`,
					trend: applicationsChange >= 0 ? 'up' : 'down',
					icon: 'Target',
					color: 'from-blue-500 to-blue-600'
				},
				{
					title: 'Response Rate',
					value: totalApps > 0 ? `${Math.round((responses / totalApps) * 100)}%` : '0%',
					change: `${responseRateChange >= 0 ? '+' : ''}${responseRateChange}%`,
					trend: responseRateChange >= 0 ? 'up' : 'down',
					icon: 'TrendingUp',
					color: 'from-green-500 to-green-600'
				},
				{
					title: 'Interview Rate',
					value: totalApps > 0 ? `${Math.round((interviews / totalApps) * 100)}%` : '0%',
					change: `${interviewRateChange >= 0 ? '+' : ''}${interviewRateChange}%`,
					trend: interviewRateChange >= 0 ? 'up' : 'down',
					icon: 'CheckCircle',
					color: 'from-purple-500 to-purple-600'
				},
				{
					title: 'Offer Rate',
					value: totalApps > 0 ? `${Math.round((offers / totalApps) * 100)}%` : '0%',
					change: `${rejectionRateChange >= 0 ? '+' : ''}${rejectionRateChange}%`,
					trend: rejectionRateChange >= 0 ? 'up' : 'down',
					icon: 'CheckCircle',
					color: 'from-green-500 to-green-600'
				}
			],
			monthlyData: formattedMonthlyData,
			topCompanies: topCompanies.map(company => ({
				name: company.companyName,
				logo: company.companyLogo,
				applications: Number(company.applications),
				responseRate: company.responseRate
			}))
		}

		return NextResponse.json(analyticsData)
	} catch (error) {
		console.error('Error fetching analytics:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
