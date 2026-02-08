import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { AlertCircle,Calendar,Clock,User } from 'lucide-react'

// Mock data for calendar events
const events=[
	{
		id: 1,
		title: 'Interview with TechCorp',
		type: 'Interview',
		date: '2024-01-15',
		time: '10:00 AM',
		location: 'Virtual (Zoom)',
		company: 'TechCorp Solutions',
		status: 'Upcoming'
	},
	{
		id: 2,
		title: 'Application Deadline',
		type: 'Deadline',
		date: '2024-01-20',
		time: '11:59 PM',
		location: 'Online',
		company: 'InnovateLab',
		status: 'Urgent'
	},
	{
		id: 3,
		title: 'Follow-up Call',
		type: 'Call',
		date: '2024-01-18',
		time: '2:00 PM',
		location: 'Phone',
		company: 'DataFlow Systems',
		status: 'Scheduled'
	},
	{
		id: 4,
		title: 'Technical Assessment',
		type: 'Assessment',
		date: '2024-01-22',
		time: '1:00 PM',
		location: 'Online Platform',
		company: 'CloudScale Inc',
		status: 'Upcoming'
	}
]

const getStatusColor=( status: string ) => {
	switch ( status ) {
		case 'Urgent':
			return 'bg-red-500/15 text-red-300 border-red-400/30'
		case 'Upcoming':
			return 'bg-blue-500/15 text-blue-300 border-blue-400/30'
		case 'Scheduled':
			return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
		default:
			return 'bg-white/[0.06] text-violet-200/70 border-white/[0.10]'
	}
}

const getTypeIcon=( type: string ) => {
	switch ( type ) {
		case 'Interview':
			return <User className="w-4 h-4" />
		case 'Deadline':
			return <AlertCircle className="w-4 h-4" />
		case 'Call':
			return <Clock className="w-4 h-4" />
		case 'Assessment':
			return <Calendar className="w-4 h-4" />
		default:
			return <Calendar className="w-4 h-4" />
	}
}

export default function CalendarPage () {
	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gradient-heading mb-2">Calendar</h1>
					<p className="text-violet-300/60">Track your interviews, deadlines, and events</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Upcoming Events */}
					<Card className="glass">
						<CardHeader>
							<CardTitle className="text-white flex items-center space-x-2">
								<Calendar className="w-5 h-5" />
								<span>Upcoming Events</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{events
								.filter( event => event.status==='Upcoming'||event.status==='Scheduled' )
								.map( ( event,index ) => (
									<div key={event.id} className="flex items-start space-x-3 p-3 bg-white/[0.04] rounded-lg border border-white/[0.08] animate-fade-up" style={{ animationDelay: `${index*80}ms` }}>
										<div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
											{getTypeIcon( event.type )}
										</div>
										<div className="flex-1">
											<h3 className="text-white font-medium">{event.title}</h3>
											<p className="text-violet-200/70 text-sm">{event.company}</p>
											<div className="flex items-center space-x-4 mt-2 text-xs text-violet-300/40">
												<span className="flex items-center space-x-1">
													<Calendar className="w-3 h-3" />
													{event.date}
												</span>
												<span className="flex items-center space-x-1">
													<Clock className="w-3 h-3" />
													{event.time}
												</span>
											</div>
										</div>
										<Badge className={getStatusColor( event.status )}>
											{event.status}
										</Badge>
									</div>
								) )}
						</CardContent>
					</Card>

					{/* Urgent Deadlines */}
					<Card className="glass">
						<CardHeader>
							<CardTitle className="text-white flex items-center space-x-2">
								<AlertCircle className="w-5 h-5 text-red-400" />
								<span>Urgent Deadlines</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{events
								.filter( event => event.status==='Urgent' )
								.map( ( event,index ) => (
									<div key={event.id} className="flex items-start space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-400/30 animate-fade-up" style={{ animationDelay: `${index*80}ms` }}>
										<div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
											<AlertCircle className="w-4 h-4 text-white" />
										</div>
										<div className="flex-1">
											<h3 className="text-white font-medium">{event.title}</h3>
											<p className="text-red-200 text-sm">{event.company}</p>
											<div className="flex items-center space-x-4 mt-2 text-xs text-red-300/60">
												<span className="flex items-center space-x-1">
													<Calendar className="w-3 h-3" />
													{event.date}
												</span>
												<span className="flex items-center space-x-1">
													<Clock className="w-3 h-3" />
													{event.time}
												</span>
											</div>
										</div>
										<Badge className="bg-red-500/15 text-red-300 border-red-400/30">
											{event.status}
										</Badge>
									</div>
								) )}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
