import { AddApplicationButton } from '@/components/dashboard/add-application-button'
import { JobApplicationsList } from '@/components/dashboard/job-applications-list'
import { DashboardStats } from '@/components/dashboard/stats'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Suspense } from 'react'

export default function DashboardPage () {
	return (
		<div className="min-h-screen">
			<div className="p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">CodeniWork Dashboard</h1>
					<p className="text-blue-200">Track your job applications and career progress</p>
				</div>

				<div className="space-y-6">
					{/* Stats Overview */}
					<Suspense fallback={<LoadingSpinner />}>
						<DashboardStats />
					</Suspense>

					{/* Main Content Grid */}
					<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
						{/* Job Applications List */}
						<div className="xl:col-span-2">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-white">
									Job Applications
								</h2>
								<AddApplicationButton />
							</div>
							<Suspense fallback={<LoadingSpinner />}>
								<JobApplicationsList />
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
									<button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
										Add New Application
									</button>
									<button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
										Schedule Follow-up
									</button>
									<button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
										Export Data
									</button>
								</div>
							</div>

							{/* Recent Activity */}
							<div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
								<h3 className="text-lg font-semibold text-white mb-4">
									Recent Activity
								</h3>
								<div className="space-y-3">
									<div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-200/30">
										<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
										<span className="text-sm text-blue-100">
											Application submitted to Google
										</span>
									</div>
									<div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-900/50 to-teal-900/50 rounded-lg border border-green-200/30">
										<div className="w-2 h-2 bg-green-400 rounded-full"></div>
										<span className="text-sm text-green-100">
											Interview scheduled with Apple
										</span>
									</div>
									<div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-200/30">
										<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
										<span className="text-sm text-purple-100">
											Follow-up email sent to Microsoft
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
