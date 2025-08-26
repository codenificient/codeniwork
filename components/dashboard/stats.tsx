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

const stats=[
	{
		title: 'Total Applications',
		value: '24',
		change: '+12%',
		changeType: 'positive',
		icon: Briefcase,
		color: 'from-blue-500 to-blue-600',
		bgColor: 'bg-blue-50/80',
		textColor: 'text-blue-600'
	},
	{
		title: 'Active Companies',
		value: '18',
		change: '+5%',
		changeType: 'positive',
		icon: Building2,
		color: 'from-purple-500 to-purple-600',
		bgColor: 'bg-purple-50/80',
		textColor: 'text-purple-600'
	},
	{
		title: 'In Progress',
		value: '8',
		change: '+2',
		changeType: 'positive',
		icon: Clock,
		color: 'from-orange-500 to-orange-600',
		bgColor: 'bg-orange-50/80',
		textColor: 'text-orange-600'
	},
	{
		title: 'Interviews',
		value: '6',
		change: '+3',
		changeType: 'positive',
		icon: Calendar,
		color: 'from-teal-500 to-teal-600',
		bgColor: 'bg-teal-50/80',
		textColor: 'text-teal-600'
	},
	{
		title: 'Offers',
		value: '2',
		change: '+1',
		changeType: 'positive',
		icon: CheckCircle,
		color: 'from-green-500 to-green-600',
		bgColor: 'bg-green-50/80',
		textColor: 'text-green-600'
	},
	{
		title: 'Rejected',
		value: '4',
		change: '-1',
		changeType: 'negative',
		icon: XCircle,
		color: 'from-red-500 to-red-600',
		bgColor: 'bg-red-50/80',
		textColor: 'text-red-600'
	}
]

export function DashboardStats () {
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
				{stats.map( ( stat,index ) => {
					const IconComponent=stat.icon
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
									<span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.changeType==='positive'
										? 'bg-green-100 text-green-800'
										:'bg-red-100 text-red-800'
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
				} )}
			</div>

			{/* Progress Bar */}
			<Card className="bg-white/10 backdrop-blur-sm border-white/20">
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-white">
							Application Success Rate
						</h3>
						<span className="text-2xl font-bold text-purple-300">
							75%
						</span>
					</div>
					<div className="w-full bg-gray-200/50 rounded-full h-3">
						<div
							className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
							style={{ width: '75%' }}
						></div>
					</div>
					<div className="flex justify-between text-sm text-blue-200 mt-2">
						<span>Applied: 24</span>
						<span>Success: 18</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
