import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { BarChart3,CheckCircle,Target,TrendingDown,TrendingUp,XCircle } from 'lucide-react'

// Mock analytics data
const stats=[
	{
		title: 'Total Applications',
		value: '24',
		change: '+12%',
		trend: 'up',
		icon: Target,
		color: 'from-blue-500 to-blue-600'
	},
	{
		title: 'Response Rate',
		value: '67%',
		change: '+8%',
		trend: 'up',
		icon: TrendingUp,
		color: 'from-green-500 to-green-600'
	},
	{
		title: 'Interview Rate',
		value: '42%',
		change: '+15%',
		trend: 'up',
		icon: CheckCircle,
		color: 'from-purple-500 to-purple-600'
	},
	{
		title: 'Rejection Rate',
		value: '33%',
		change: '-5%',
		trend: 'down',
		icon: XCircle,
		color: 'from-red-500 to-red-600'
	}
]

const monthlyData=[
	{ month: 'Jan',applications: 8,interviews: 3,offers: 1 },
	{ month: 'Feb',applications: 12,interviews: 5,offers: 2 },
	{ month: 'Mar',applications: 15,interviews: 7,offers: 3 },
	{ month: 'Apr',applications: 18,interviews: 9,offers: 4 },
	{ month: 'May',applications: 22,interviews: 11,offers: 5 },
	{ month: 'Jun',applications: 24,interviews: 12,offers: 6 }
]

const topCompanies=[
	{ name: 'TechCorp Solutions',applications: 5,responseRate: '80%' },
	{ name: 'InnovateLab',applications: 4,responseRate: '75%' },
	{ name: 'DataFlow Systems',applications: 3,responseRate: '67%' },
	{ name: 'CloudScale Inc',applications: 3,responseRate: '60%' }
]

export default function AnalyticsPage () {
	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
					<p className="text-blue-200">Track your job search progress and insights</p>
				</div>

				{/* Key Statistics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map( ( stat ) => {
						const Icon=stat.icon
						return (
							<Card key={stat.title} className="bg-white/10 backdrop-blur-sm border-white/20">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-blue-200 text-sm font-medium">{stat.title}</p>
											<p className="text-white text-2xl font-bold">{stat.value}</p>
										</div>
										<div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
											<Icon className="w-6 h-6 text-white" />
										</div>
									</div>
									<div className="flex items-center mt-4">
										{stat.trend==='up'? (
											<TrendingUp className="w-4 h-4 text-green-400 mr-2" />
										):(
											<TrendingDown className="w-4 h-4 text-red-400 mr-2" />
										)}
										<span className={`text-sm ${stat.trend==='up'? 'text-green-400':'text-red-400'}`}>
											{stat.change} from last month
										</span>
									</div>
								</CardContent>
							</Card>
						)
					} )}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Monthly Progress */}
					<Card className="bg-white/10 backdrop-blur-sm border-white/20">
						<CardHeader>
							<CardTitle className="text-white flex items-center space-x-2">
								<BarChart3 className="w-5 h-5" />
								<span>Monthly Progress</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{monthlyData.map( ( data ) => (
									<div key={data.month} className="flex items-center justify-between">
										<span className="text-white font-medium">{data.month}</span>
										<div className="flex items-center space-x-6">
											<div className="text-center">
												<p className="text-blue-200 text-xs">Applications</p>
												<p className="text-white font-semibold">{data.applications}</p>
											</div>
											<div className="text-center">
												<p className="text-purple-200 text-xs">Interviews</p>
												<p className="text-white font-semibold">{data.interviews}</p>
											</div>
											<div className="text-center">
												<p className="text-green-200 text-xs">Offers</p>
												<p className="text-white font-semibold">{data.offers}</p>
											</div>
										</div>
									</div>
								) )}
							</div>
						</CardContent>
					</Card>

					{/* Top Companies */}
					<Card className="bg-white/10 backdrop-blur-sm border-white/20">
						<CardHeader>
							<CardTitle className="text-white flex items-center space-x-2">
								<Target className="w-5 h-5" />
								<span>Top Companies</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{topCompanies.map( ( company,index ) => (
									<div key={company.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
										<div className="flex items-center space-x-3">
											<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
												{index+1}
											</div>
											<div>
												<p className="text-white font-medium">{company.name}</p>
												<p className="text-blue-200 text-sm">{company.applications} applications</p>
											</div>
										</div>
										<Badge className="bg-green-600/20 text-green-200 border-green-400/30">
											{company.responseRate}
										</Badge>
									</div>
								) )}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
