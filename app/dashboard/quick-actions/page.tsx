import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import {
	Calendar,
	Clock,
	ExternalLink,
	FileText,
	Mail,
	Plus,
	Search,
	Star,
	TrendingUp,
	Users,
	Zap
} from 'lucide-react'

// Quick action categories
const quickActions=[
	{
		category: 'Applications',
		actions: [
			{
				title: 'Add New Application',
				description: 'Track a new job application',
				icon: Plus,
				color: 'from-blue-500 to-blue-600',
				href: '/dashboard/applications',
				shortcut: 'Ctrl + N'
			},
			{
				title: 'Search Jobs',
				description: 'Find new opportunities',
				icon: Search,
				color: 'from-green-500 to-green-600',
				href: '#',
				shortcut: 'Ctrl + S'
			},
			{
				title: 'Update Status',
				description: 'Update application progress',
				icon: TrendingUp,
				color: 'from-purple-500 to-purple-600',
				href: '/dashboard/applications',
				shortcut: 'Ctrl + U'
			}
		]
	},
	{
		category: 'Documents',
		actions: [
			{
				title: 'Upload Resume',
				description: 'Add new resume version',
				icon: FileText,
				color: 'from-orange-500 to-orange-600',
				href: '/dashboard/documents',
				shortcut: 'Ctrl + R'
			},
			{
				title: 'Create Cover Letter',
				description: 'Write a new cover letter',
				icon: FileText,
				color: 'from-pink-500 to-pink-600',
				href: '/dashboard/documents',
				shortcut: 'Ctrl + L'
			},
			{
				title: 'Update Portfolio',
				description: 'Refresh your portfolio',
				icon: FileText,
				color: 'from-indigo-500 to-indigo-600',
				href: '/dashboard/documents',
				shortcut: 'Ctrl + P'
			}
		]
	},
	{
		category: 'Networking',
		actions: [
			{
				title: 'Add New Contact',
				description: 'Save a new connection',
				icon: Users,
				color: 'from-teal-500 to-teal-600',
				href: '/dashboard/contacts',
				shortcut: 'Ctrl + C'
			},
			{
				title: 'Schedule Follow-up',
				description: 'Set reminder for contact',
				icon: Calendar,
				color: 'from-cyan-500 to-cyan-600',
				href: '/dashboard/calendar',
				shortcut: 'Ctrl + F'
			},
			{
				title: 'Send Thank You',
				description: 'Follow up after interview',
				icon: Mail,
				color: 'from-emerald-500 to-emerald-600',
				href: '#',
				shortcut: 'Ctrl + T'
			}
		]
	}
]

// Recent activities
const recentActivities=[
	{
		id: 1,
		action: 'Application submitted',
		company: 'TechCorp Solutions',
		time: '2 hours ago',
		status: 'Completed'
	},
	{
		id: 2,
		action: 'Resume updated',
		company: 'Personal',
		time: '1 day ago',
		status: 'Completed'
	},
	{
		id: 3,
		action: 'Interview scheduled',
		company: 'InnovateLab',
		time: '2 days ago',
		status: 'Pending'
	},
	{
		id: 4,
		action: 'Cover letter created',
		company: 'DataFlow Systems',
		time: '3 days ago',
		status: 'Completed'
	}
]

const getStatusColor=( status: string ) => {
	switch ( status ) {
		case 'Completed':
			return 'bg-green-600/20 text-green-200 border-green-400/30'
		case 'Pending':
			return 'bg-yellow-600/20 text-yellow-200 border-yellow-400/30'
		default:
			return 'bg-gray-600/20 text-gray-200 border-gray-400/30'
	}
}

export default function QuickActionsPage () {
	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Quick Actions</h1>
					<p className="text-blue-200">Fast access to common tasks and shortcuts</p>
				</div>

				{/* Quick Actions Grid */}
				<div className="space-y-8 mb-8">
					{quickActions.map( ( category ) => (
						<div key={category.category}>
							<h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
								<Zap className="w-5 h-5 text-yellow-400" />
								<span>{category.category}</span>
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{category.actions.map( ( action ) => {
									const Icon=action.icon
									return (
										<Card key={action.title} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200 group cursor-pointer">
											<CardContent className="p-6">
												<div className="flex items-start justify-between mb-4">
													<div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
														<Icon className="w-6 h-6 text-white" />
													</div>
													<Badge variant="secondary" className="bg-white/20 text-white/80 border-white/30 text-xs">
														{action.shortcut}
													</Badge>
												</div>
												<h3 className="text-white font-medium mb-2 group-hover:text-blue-200 transition-colors">
													{action.title}
												</h3>
												<p className="text-blue-200 text-sm mb-4">
													{action.description}
												</p>
												<Button
													variant="ghost"
													size="sm"
													className="w-full text-blue-200 hover:text-white hover:bg-white/20 group-hover:bg-gradient-to-r group-hover:from-purple-600/40 group-hover:to-blue-600/40 transition-all duration-200"
												>
													<ExternalLink className="w-4 h-4 mr-2" />
													Go to {action.title}
												</Button>
											</CardContent>
										</Card>
									)
								} )}
							</div>
						</div>
					) )}
				</div>

				{/* Recent Activities */}
				<Card className="bg-white/10 backdrop-blur-sm border-white/20">
					<CardHeader>
						<CardTitle className="text-white flex items-center space-x-2">
							<Clock className="w-5 h-5" />
							<span>Recent Activities</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentActivities.map( ( activity ) => (
								<div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
											<Star className="w-4 h-4 text-white" />
										</div>
										<div>
											<p className="text-white font-medium">{activity.action}</p>
											<p className="text-blue-200 text-sm">{activity.company}</p>
										</div>
									</div>
									<div className="flex items-center space-x-3">
										<Badge className={getStatusColor( activity.status )}>
											{activity.status}
										</Badge>
										<span className="text-xs text-blue-200">{activity.time}</span>
									</div>
								</div>
							) )}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
