'use client'

import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { BarChart3,Building2,CheckCircle,RefreshCw,Target,TrendingDown,TrendingUp } from 'lucide-react'
import { useEffect,useState } from 'react'

interface AnalyticsData {
	stats: Array<{
		title: string
		value: string
		change: string
		trend: 'up'|'down'
		icon: string
		color: string
	}>
	monthlyData: Array<{
		month: string
		applications: number
		interviews: number
		offers: number
	}>
	topCompanies: Array<{
		name: string
		logo: string|null
		applications: number
		responseRate: string
	}>
}

export default function AnalyticsPage () {
	const [ analyticsData,setAnalyticsData ]=useState<AnalyticsData|null>( null )
	const [ isLoading,setIsLoading ]=useState( true )
	const [ error,setError ]=useState<string|null>( null )

	useEffect( () => {
		fetchAnalytics()
	},[] )

	const fetchAnalytics=async () => {
		try {
			setIsLoading( true )
			setError( null )

			const response=await fetch( '/api/dashboard/analytics' )
			if ( !response.ok ) {
				throw new Error( 'Failed to fetch analytics data' )
			}

			const data=await response.json()
			setAnalyticsData( data )
		} catch ( error ) {
			console.error( 'Error fetching analytics:',error )
			setError( error instanceof Error? error.message:'Failed to fetch analytics' )
		} finally {
			setIsLoading( false )
		}
	}

	const handleRefresh=() => {
		fetchAnalytics()
	}

	const getIconComponent=( iconName: string ) => {
		const iconMap: { [ key: string ]: any }={
			Target,
			TrendingUp,
			CheckCircle,
			TrendingDown
		}
		return iconMap[ iconName ]||Target
	}

	if ( isLoading ) {
		return (
			<div className="min-h-screen">
				<DashboardHeader />
				<div className="p-6">
					<div className="flex items-center justify-center h-64">
						<LoadingSpinner />
					</div>
				</div>
			</div>
		)
	}

	if ( error ) {
		return (
			<div className="min-h-screen">
				<DashboardHeader />
				<div className="p-6">
					<div className="text-center py-12">
						<BarChart3 className="w-16 h-16 text-red-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-white mb-2">Error Loading Analytics</h3>
						<p className="text-violet-200/70 mb-4">{error}</p>
						<Button onClick={handleRefresh}>
							<RefreshCw className="w-4 h-4 mr-2" />
							Try Again
						</Button>
					</div>
				</div>
			</div>
		)
	}

	if ( !analyticsData ) {
		return (
			<div className="min-h-screen">
				<DashboardHeader />
				<div className="p-6">
					<div className="text-center py-12">
						<BarChart3 className="w-16 h-16 text-violet-300/40 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-white mb-2">No Analytics Data</h3>
						<p className="text-violet-200/70">Start adding job applications to see your analytics.</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold text-gradient-heading mb-2">Analytics</h1>
						<p className="text-violet-300/60">Track your job search progress and insights</p>
					</div>
					<Button
						onClick={handleRefresh}
						variant="outline"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Refresh
					</Button>
				</div>

				{/* Key Statistics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{analyticsData.stats.map( ( stat,index ) => {
						const Icon=getIconComponent( stat.icon )
						return (
							<Card key={stat.title} className="glass glass-interactive animate-fade-up" style={{ animationDelay: `${index*80}ms` }}>
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-violet-200/70 text-sm font-medium">{stat.title}</p>
											<p className="text-white text-2xl font-bold text-gradient-primary">{stat.value}</p>
										</div>
										<div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
											<Icon className="w-6 h-6 text-white" />
										</div>
									</div>
									<div className="flex items-center mt-4">
										{stat.trend==='up'? (
											<TrendingUp className="w-4 h-4 text-emerald-400 mr-2" />
										):(
											<TrendingDown className="w-4 h-4 text-red-400 mr-2" />
										)}
										<span className={`text-sm ${stat.trend==='up'? 'text-emerald-400':'text-red-400'}`}>
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
					<Card className="glass">
						<CardHeader>
							<CardTitle className="text-white flex items-center space-x-2">
								<BarChart3 className="w-5 h-5" />
								<span>Monthly Progress</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{analyticsData.monthlyData.length===0? (
								<div className="text-center py-8">
									<BarChart3 className="w-12 h-12 text-violet-300/40 mx-auto mb-2" />
									<p className="text-violet-200/70">No monthly data available</p>
								</div>
							):(
								<div className="space-y-4">
									{analyticsData.monthlyData.map( ( data,index ) => (
										<div key={data.month} className="flex items-center justify-between p-3 bg-white/[0.04] rounded-lg border border-white/[0.08] animate-fade-up" style={{ animationDelay: `${index*50}ms` }}>
											<span className="text-white font-medium">{data.month}</span>
											<div className="flex items-center space-x-6">
												<div className="text-center">
													<p className="text-violet-200/70 text-xs">Applications</p>
													<p className="text-white font-semibold">{data.applications}</p>
												</div>
												<div className="text-center">
													<p className="text-purple-300/70 text-xs">Interviews</p>
													<p className="text-white font-semibold">{data.interviews}</p>
												</div>
												<div className="text-center">
													<p className="text-emerald-300/70 text-xs">Offers</p>
													<p className="text-white font-semibold">{data.offers}</p>
												</div>
											</div>
										</div>
									) )}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Top Companies */}
					<Card className="glass">
						<CardHeader>
							<CardTitle className="text-white flex items-center space-x-2">
								<Target className="w-5 h-5" />
								<span>Top Companies</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{analyticsData.topCompanies.length===0? (
								<div className="text-center py-8">
									<Building2 className="w-12 h-12 text-violet-300/40 mx-auto mb-2" />
									<p className="text-violet-200/70">No company data available</p>
								</div>
							):(
								<div className="space-y-4">
									{analyticsData.topCompanies.map( ( company,index ) => (
										<div key={company.name} className="flex items-center justify-between p-3 bg-white/[0.04] rounded-lg border border-white/[0.08] animate-fade-up" style={{ animationDelay: `${index*50}ms` }}>
											<div className="flex items-center space-x-3">
												<div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
													{index+1}
												</div>
												<div className="flex items-center space-x-2">
													{company.logo? (
														<img
															src={company.logo}
															alt={`${company.name} logo`}
															className="w-6 h-6 rounded object-cover"
															onError={( e ) => {
																const target=e.target as HTMLImageElement
																target.style.display='none'
															}}
														/>
													):(
														<Building2 className="w-5 h-5 text-violet-300/40" />
													)}
													<div>
														<p className="text-white font-medium">{company.name}</p>
														<p className="text-violet-200/70 text-sm">{company.applications} application{company.applications!==1? 's':''}</p>
													</div>
												</div>
											</div>
											<Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-400/30">
												{company.responseRate}
											</Badge>
										</div>
									) )}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
