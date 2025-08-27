'use client'

import { AddApplicationButton } from '@/components/dashboard/add-application-button'
import { ExportDataDialog } from '@/components/dashboard/export-data-dialog'
import { DashboardHeader } from '@/components/dashboard/header'
import { JobApplicationsList } from '@/components/dashboard/job-applications-list'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ScheduleFollowupDialog } from '@/components/dashboard/schedule-followup-dialog'
import { DashboardStats } from '@/components/dashboard/stats'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Calendar, FileText } from 'lucide-react'
import { Suspense, useState } from 'react'

export default function DashboardPage() {
	const [refreshKey, setRefreshKey] = useState(0)
	const [isScheduleFollowupOpen, setIsScheduleFollowupOpen] = useState(false)
	const [isExportDataOpen, setIsExportDataOpen] = useState(false)

	const handleRefresh = async () => {
		// Increment refresh key to trigger re-renders
		setRefreshKey(prev => prev + 1)
	}

	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">CodeniWork Dashboard</h1>
					<p className="text-blue-200">Track your job applications and career progress</p>
				</div>

				<div className="space-y-6">
					{/* Stats Overview */}
					<Suspense fallback={<LoadingSpinner />}>
						<DashboardStats key={refreshKey} />
					</Suspense>

					{/* Main Content Grid */}
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
						{/* Job Applications List */}
						<div className="xl:col-span-2">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-white">
									Job Applications
								</h2>
								<AddApplicationButton onApplicationAdded={handleRefresh} />
							</div>
							<Suspense fallback={<LoadingSpinner />}>
								<JobApplicationsList key={refreshKey} />
							</Suspense>
						</div>

						{/* Right Sidebar */}
						<div className="space-y-6">
							{/* Quick Actions */}
							<div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
								<h3 className="text-lg font-semibold text-white mb-4">
									Quick Actions
								</h3>
								<div className="space-y-3">
									<AddApplicationButton variant="quick-action" onApplicationAdded={handleRefresh} />
									<Button
										variant="outline"
										onClick={() => setIsScheduleFollowupOpen(true)}
										className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
									>
										<Calendar className="w-4 h-4 mr-2" />
										Schedule Follow-up
									</Button>
									<Button
										variant="outline"
										onClick={() => setIsExportDataOpen(true)}
										className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
									>
										<FileText className="w-4 h-4 mr-2" />
										Export Data
									</Button>
								</div>
							</div>

							{/* Recent Activity */}
							<Suspense fallback={<LoadingSpinner />}>
								<RecentActivity key={refreshKey} />
							</Suspense>
						</div>
					</div>
				</div>
			</div>

			{/* Dialogs */}
			<ScheduleFollowupDialog 
				open={isScheduleFollowupOpen} 
				onOpenChange={setIsScheduleFollowupOpen}
			/>
			
			<ExportDataDialog 
				open={isExportDataOpen} 
				onOpenChange={setIsExportDataOpen}
			/>
		</div>
	)
}
