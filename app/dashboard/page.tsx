import { AddApplicationButton } from '@/components/dashboard/add-application-button'
import { DashboardHeader } from '@/components/dashboard/header'
import { JobApplicationsList } from '@/components/dashboard/job-applications-list'
import { DashboardStats } from '@/components/dashboard/stats'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Sidebar } from '@/components/ui/sidebar'
import { Suspense } from 'react'

export default function DashboardPage () {
	return (
		<div className="flex h-screen overflow-hidden relative">
			{/* Colorful Background Elements */}
			<div className="fixed inset-0 pointer-events-none">
				{/* Large gradient circles */}
				<div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute bottom-32 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
				{/* Floating orbs */}
				<div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
				<div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300" />
				<div className="absolute bottom-1/4 left-1/2 w-5 h-5 bg-green-400 rounded-full animate-bounce delay-700" />
			</div>

			{/* Sidebar */}
			<Sidebar />

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<DashboardHeader />

				<main className="flex-1 overflow-y-auto p-6 space-y-6">
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
				</main>
			</div>
		</div>
	)
}
