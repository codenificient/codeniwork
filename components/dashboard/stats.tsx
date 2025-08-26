'use client'

import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import {
	Briefcase,
	Building2,
	Calendar,
	CheckCircle,
	Clock,
	TrendingUp,
	XCircle
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/lib/db/queries'

interface DashboardStatsData {
	totalApplications: number
	activeCompanies: number
	inProgress: number
	interviews: number
	offers: number
	rejected: number
	successRate: number
	applied: number
	success: number
}

export function DashboardStats() {
	const { data: session } = useSession()
	const [stats, setStats] = useState<DashboardStatsData | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function fetchStats() {
			if (!session?.user?.id) return
			
			try {
				const statsData = await getDashboardStats(session.user.id)
				setStats(statsData)
			} catch (error) {
				console.error('Error fetching dashboard stats:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchStats()
	}, [session?.user?.id])

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold text-white">Overview</h2>
					<div className="flex items-center space-x-2 text-sm text-blue-200">
						<TrendingUp className="w-4 h-4" />
						<span>Last 30 days</span>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 animate-pulse">
							<CardHeader className="pb-3">
								<div className="h-8 bg-white/20 rounded"></div>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="h-6 bg-white/20 rounded mb-2"></div>
								<div className="h-4 bg-white/20 rounded"></div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	if (!stats) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold text-white">Overview</h2>
					<div className="flex items-center space-x-2 text-sm text-blue-200">
						<TrendingUp className="w-4 h-4" />
						<span>Last 30 days</span>
					</div>
				</div>
				<div className="text-center py-8">
					<p className="text-blue-200">No data available</p>
				</div>
			</div>
		)
	}

	const statsData = [
		{
			title: 'Total Applications',
			value: stats.totalApplications.toString(),
			change: '+0%',
			changeType: 'positive' as const,
			icon: Briefcase,
			color: 'from-blue-500 to-blue-600',
			bgColor: 'bg-blue-50/80',
			textColor: 'text-blue-600'
		},
		{
			title: 'Active Companies',
			value: stats.activeCompanies.toString(),
			change: '+0%',
			changeType: 'positive' as const,
			icon: Building2,
			color: 'from-purple-500 to-purple-600',
			bgColor: 'bg-purple-50/80',
			textColor: 'text-purple-600'
		},
		{
			title: 'In Progress',
			value: stats.inProgress.toString(),
			change: '+0',
			changeType: 'positive' as const,
			icon: Clock,
			color: 'from-orange-500 to-orange-600',
			bgColor: 'bg-orange-50/80',
			textColor: 'text-orange-600'
		},
		{
			title: 'Interviews',
			value: stats.interviews.toString(),
			change: '+0',
			changeType: 'positive' as const,
			icon: Calendar,
			color: 'from-teal-500 to-teal-600',
			bgColor: 'bg-teal-50/80',
			textColor: 'text-teal-600'
		},
		{
			title: 'Offers',
			value: stats.offers.toString(),
			change: '+0',
			changeType: 'positive' as const,
			icon: CheckCircle,
			color: 'from-green-500 to-green-600',
			bgColor: 'bg-green-50/80',
			textColor: 'text-green-600'
		},
		{
			title: 'Rejected',
			value: stats.rejected.toString(),
			change: '+0',
			changeType: 'positive' as const,
			icon: XCircle,
			color: 'from-red-500 to-red-600',
			bgColor: 'bg-red-50/80',
			textColor: 'text-red-600'
		}
	]

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-white">
					Overview
				</h2>
				<div className="flex items-center space-x-2 text-sm text-blue-200">
					<TrendingUp className="w-4 h-4" />
					<span>Last 30 days</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
				{statsData.map((stat, index) => {
					const IconComponent = stat.icon
					return (
						<Card
							key={index}
							className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/10 backdrop-blur-sm border-white/20"
						>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div className={`p-2 rounded-lg ${stat.bgColor}`}>
										<IconComponent className={`w-5 h-5 ${stat.textColor}`} />
									</div>
									<span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.changeType === 'positive'
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'
										}`}>
										{stat.change}
									</span>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<CardTitle className="text-2xl font-bold text-white mb-1">
									{stat.value}
								</CardTitle>
								<p className="text-sm text-blue-200">
									{stat.title}
								</p>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* Progress Bar */}
			<Card className="bg-white/10 backdrop-blur-sm border-white/20">
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-white">
							Application Success Rate
						</h3>
						<span className="text-2xl font-bold text-purple-300">
							{stats.successRate}%
						</span>
					</div>
					<div className="w-full bg-gray-200/50 rounded-full h-3">
						<div
							className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
							style={{ width: `${stats.successRate}%` }}
						></div>
					</div>
					<div className="flex justify-between text-sm text-blue-200 mt-2">
						<span>Applied: {stats.applied}</span>
						<span>Success: {stats.success}</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
