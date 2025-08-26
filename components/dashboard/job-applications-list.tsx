'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card,CardContent } from '@/components/ui/card'
// Database queries moved to API routes
import {
	AlertCircle,
	Building2,
	Calendar,
	CheckCircle,
	Clock,
	Edit,
	ExternalLink,
	MapPin,
	Star,
	Trash2,
	XCircle
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect,useState } from 'react'

interface JobApplication {
	id: string
	position: string
	status: string
	priority: string|null
	salary: string|null
	location: string|null
	jobUrl: string|null
	notes: string|null
	appliedAt: Date|string
	deadline: Date|string|null
	isRemote: boolean|null
	company: {
		id: string
		name: string
		logo: string|null
		website: string|null
	}
}

const statusConfig={
	applied: { label: 'Applied',color: 'bg-blue-100 text-blue-800',icon: Clock },
	screening: { label: 'Screening',color: 'bg-yellow-100 text-yellow-800',icon: AlertCircle },
	interview: { label: 'Interview',color: 'bg-purple-100 text-purple-800',icon: Calendar },
	offer: { label: 'Offer',color: 'bg-green-100 text-green-800',icon: CheckCircle },
	rejected: { label: 'Rejected',color: 'bg-red-100 text-red-800',icon: XCircle },
	withdrawn: { label: 'Withdrawn',color: 'bg-gray-100 text-gray-800',icon: XCircle }
}

const priorityConfig={
	low: { label: 'Low',color: 'bg-gray-100 text-gray-800' },
	medium: { label: 'Medium',color: 'bg-yellow-100 text-yellow-800' },
	high: { label: 'High',color: 'bg-red-100 text-red-800' }
}

export function JobApplicationsList () {
	const { data: session }=useSession()
	const [ applications,setApplications ]=useState<JobApplication[]>( [] )
	const [ isLoading,setIsLoading ]=useState( true )

	useEffect( () => {
		async function fetchApplications () {
			if ( !session?.user?.id ) return

			try {
				const response=await fetch( '/api/dashboard/applications' )
				if ( !response.ok ) {
					throw new Error( 'Failed to fetch applications' )
				}
				const apps=await response.json()
				setApplications( apps )
			} catch ( error ) {
				console.error( 'Error fetching job applications:',error )
			} finally {
				setIsLoading( false )
			}
		}

		fetchApplications()
	},[ session?.user?.id ] )

	const formatDate=( date: Date|string ) => {
		// Convert string to Date if needed
		const dateObj=typeof date==='string'? new Date( date ):date

		// Check if date is valid
		if ( isNaN( dateObj.getTime() ) ) {
			return 'Invalid date'
		}

		return dateObj.toLocaleDateString( 'en-US',{
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		} )
	}

	if ( isLoading ) {
		return (
			<div className="space-y-4">
				{Array.from( { length: 3 } ).map( ( _,i ) => (
					<Card key={i} className="bg-white/80 backdrop-blur-sm animate-pulse">
						<CardContent className="p-6">
							<div className="flex items-start space-x-4">
								<div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
								<div className="flex-1 space-y-3">
									<div className="h-6 bg-gray-200 rounded w-3/4"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
									<div className="h-4 bg-gray-200 rounded w-2/3"></div>
								</div>
							</div>
						</CardContent>
					</Card>
				) )}
			</div>
		)
	}

	if ( applications.length===0 ) {
		return (
			<div className="text-center py-12">
				<Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
				<h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
				<p className="text-gray-600">Start tracking your job search by adding your first application.</p>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{applications.map( ( app ) => {
				const status=statusConfig[ app.status as keyof typeof statusConfig ]
				const priority=app.priority? priorityConfig[ app.priority as keyof typeof priorityConfig ]:null
				const StatusIcon=status.icon

				return (
					<Card
						key={app.id}
						className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
					>
						<CardContent className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex items-start space-x-4 flex-1">
									{/* Company Logo */}
									<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center border border-purple-200/50">
										{app.company.logo? (
											<img
												src={app.company.logo}
												alt={`${app.company.name} logo`}
												className="w-10 h-10 rounded-lg"
												onError={( e ) => {
													const target=e.target as HTMLImageElement
													target.style.display='none'
													target.nextElementSibling?.classList.remove( 'hidden' )
												}}
											/>
										):null}
										<Building2 className="w-8 h-8 text-gray-400 hidden" />
									</div>

									{/* Application Details */}
									<div className="flex-1 space-y-3">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
													{app.position}
												</h3>
												<div className="flex items-center space-x-2 mt-1">
													<Building2 className="w-4 h-4 text-gray-500" />
													<span className="text-lg font-medium text-gray-700">
														{app.company.name}
													</span>
												</div>
											</div>

											<div className="flex items-center space-x-2">
												<Badge className={status.color}>
													<StatusIcon className="w-3 h-3 mr-1" />
													{status.label}
												</Badge>
												{priority&&(
													<Badge className={priority.color}>
														{priority.label}
													</Badge>
												)}
											</div>
										</div>

										<div className="flex items-center space-x-4 text-sm text-gray-600">
											{app.location&&(
												<div className="flex items-center space-x-1">
													<MapPin className="w-4 h-4" />
													<span>{app.location}</span>
													{app.isRemote&&(
														<Badge variant="outline" className="ml-2 text-xs">
															Remote
														</Badge>
													)}
												</div>
											)}
											<div className="flex items-center space-x-1">
												<Calendar className="w-4 h-4" />
												<span>Applied {formatDate( app.appliedAt )}</span>
											</div>
											{app.salary&&(
												<div className="flex items-center space-x-1">
													<Star className="w-4 h-4" />
													<span>{app.salary}</span>
												</div>
											)}
										</div>

										{app.notes&&(
											<p className="text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100/50">
												{app.notes}
											</p>
										)}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center space-x-2 ml-4">
									{app.jobUrl&&(
										<Button
											variant="outline"
											size="sm"
											onClick={() => window.open( app.jobUrl!,'_blank' )}
											className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
										>
											<ExternalLink className="w-4 h-4" />
										</Button>
									)}
									<Button
										variant="outline"
										size="sm"
										className="text-gray-600 hover:text-gray-700 border-gray-200 hover:border-gray-300"
									>
										<Edit className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)
			} )}
		</div>
	)
}
