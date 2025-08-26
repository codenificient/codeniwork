import { db } from './index'
import { jobApplications, companies, applicationEvents, users } from './schema'
import { eq, and, count, desc, sql } from 'drizzle-orm'

export async function getDashboardStats(userId: string) {
	// Get total applications for the user
	const totalApplications = await db
		.select({ count: count() })
		.from(jobApplications)
		.where(eq(jobApplications.userId, userId))

	// Get applications by status
	const applicationsByStatus = await db
		.select({
			status: jobApplications.status,
			count: count()
		})
		.from(jobApplications)
		.where(eq(jobApplications.userId, userId))
		.groupBy(jobApplications.status)

	// Get unique companies
	const uniqueCompanies = await db
		.select({ count: count() })
		.from(jobApplications)
		.innerJoin(companies, eq(jobApplications.companyId, companies.id))
		.where(eq(jobApplications.userId, userId))

	// Calculate success rate (offers / total applications)
	const offersCount = await db
		.select({ count: count() })
		.from(jobApplications)
		.where(and(
			eq(jobApplications.userId, userId),
			eq(jobApplications.status, 'offer')
		))

	const totalCount = totalApplications[0]?.count || 0
	const offers = offersCount[0]?.count || 0
	const successRate = totalCount > 0 ? Math.round((offers / totalCount) * 100) : 0

	// Convert status counts to a map
	const statusCounts = applicationsByStatus.reduce((acc, item) => {
		acc[item.status] = Number(item.count)
		return acc
	}, {} as Record<string, number>)

	return {
		totalApplications: totalCount,
		activeCompanies: uniqueCompanies[0]?.count || 0,
		inProgress: (statusCounts.screening || 0) + (statusCounts.interview || 0),
		interviews: statusCounts.interview || 0,
		offers: offers,
		rejected: statusCounts.rejected || 0,
		successRate,
		applied: statusCounts.applied || 0,
		success: offers
	}
}

export async function getJobApplications(userId: string) {
	const applications = await db
		.select({
			id: jobApplications.id,
			position: jobApplications.position,
			status: jobApplications.status,
			priority: jobApplications.priority,
			salary: jobApplications.salary,
			location: jobApplications.location,
			jobUrl: jobApplications.jobUrl,
			notes: jobApplications.notes,
			appliedAt: jobApplications.appliedAt,
			deadline: jobApplications.deadline,
			isRemote: jobApplications.isRemote,
			company: {
				id: companies.id,
				name: companies.name,
				logo: companies.logo,
				website: companies.website
			}
		})
		.from(jobApplications)
		.innerJoin(companies, eq(jobApplications.companyId, companies.id))
		.where(eq(jobApplications.userId, userId))
		.orderBy(desc(jobApplications.appliedAt))

	return applications
}

export async function getRecentActivity(userId: string, limit: number = 5) {
	const events = await db
		.select({
			id: applicationEvents.id,
			type: applicationEvents.type,
			title: applicationEvents.title,
			description: applicationEvents.description,
			date: applicationEvents.date,
			application: {
				position: jobApplications.position,
				companyName: companies.name
			}
		})
		.from(applicationEvents)
		.innerJoin(jobApplications, eq(applicationEvents.applicationId, jobApplications.id))
		.innerJoin(companies, eq(jobApplications.companyId, companies.id))
		.where(eq(jobApplications.userId, userId))
		.orderBy(desc(applicationEvents.date))
		.limit(limit)

	return events
}

export async function getApplicationCountsByStatus(userId: string) {
	const counts = await db
		.select({
			status: jobApplications.status,
			count: count()
		})
		.from(jobApplications)
		.where(eq(jobApplications.userId, userId))
		.groupBy(jobApplications.status)

	return counts
}
