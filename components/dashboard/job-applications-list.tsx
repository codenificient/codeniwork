'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card,CardContent } from '@/components/ui/card'
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
import { useState } from 'react'

// Sample data - in a real app, this would come from your database
const sampleApplications=[
	{
		id: 1,
		company: 'Google',
		position: 'Senior Software Engineer',
		location: 'Mountain View, CA',
		status: 'interview',
		priority: 'high',
		appliedDate: '2024-01-15',
		salary: '$150k - $200k',
		isRemote: false,
		notes: 'Great opportunity with interesting projects. Team seems collaborative.',
		logo: 'https://logo.clearbit.com/google.com',
		jobUrl: 'https://careers.google.com/jobs/results/123456789'
	},
	{
		id: 2,
		company: 'Apple',
		position: 'iOS Developer',
		location: 'Cupertino, CA',
		status: 'screening',
		priority: 'high',
		appliedDate: '2024-01-20',
		salary: '$140k - $180k',
		isRemote: false,
		notes: 'Excited about working on iOS apps. Need to prepare for technical interview.',
		logo: 'https://logo.clearbit.com/apple.com',
		jobUrl: 'https://jobs.apple.com/en-us/details/123456789'
	},
	{
		id: 3,
		company: 'Microsoft',
		position: 'Full Stack Developer',
		location: 'Redmond, WA',
		status: 'applied',
		priority: 'medium',
		appliedDate: '2024-01-18',
		salary: '$130k - $170k',
		isRemote: true,
		notes: 'Remote position with good benefits. Azure team looks interesting.',
		logo: 'https://logo.clearbit.com/microsoft.com',
		jobUrl: 'https://careers.microsoft.com/us/en/job/123456789'
	},
	{
		id: 4,
		company: 'Netflix',
		position: 'Backend Engineer',
		location: 'Los Gatos, CA',
		status: 'offer',
		priority: 'high',
		appliedDate: '2024-01-10',
		salary: '$180k - $250k',
		isRemote: false,
		notes: 'Amazing offer! Great culture and challenging work.',
		logo: 'https://logo.clearbit.com/netflix.com',
		jobUrl: 'https://jobs.netflix.com/jobs/123456789'
	},
	{
		id: 5,
		company: 'Amazon',
		position: 'DevOps Engineer',
		location: 'Seattle, WA',
		status: 'rejected',
		priority: 'medium',
		appliedDate: '2024-01-12',
		salary: '$140k - $190k',
		isRemote: false,
		notes: 'Interview went well but didn\'t get the role. Good experience though.',
		logo: 'https://logo.clearbit.com/amazon.com',
		jobUrl: 'https://www.amazon.jobs/en/jobs/123456789'
	}
]

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
	const [ applications ]=useState( sampleApplications )

	const formatDate=( dateString: string ) => {
		return new Date( dateString ).toLocaleDateString( 'en-US',{
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		} )
	}

	return (
		<div className="space-y-4">
			{applications.map( ( app ) => {
				const status=statusConfig[ app.status as keyof typeof statusConfig ]
				const priority=priorityConfig[ app.priority as keyof typeof priorityConfig ]
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
										{app.logo? (
											<img
												src={app.logo}
												alt={`${app.company} logo`}
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
														{app.company}
													</span>
												</div>
											</div>

											<div className="flex items-center space-x-2">
												<Badge className={status.color}>
													<StatusIcon className="w-3 h-3 mr-1" />
													{status.label}
												</Badge>
												<Badge className={priority.color}>
													{priority.label}
												</Badge>
											</div>
										</div>

										<div className="flex items-center space-x-4 text-sm text-gray-600">
											<div className="flex items-center space-x-1">
												<MapPin className="w-4 h-4" />
												<span>{app.location}</span>
												{app.isRemote&&(
													<Badge variant="outline" className="ml-2 text-xs">
														Remote
													</Badge>
												)}
											</div>
											<div className="flex items-center space-x-1">
												<Calendar className="w-4 h-4" />
												<span>Applied {formatDate( app.appliedDate )}</span>
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
											onClick={() => window.open( app.jobUrl,'_blank' )}
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
