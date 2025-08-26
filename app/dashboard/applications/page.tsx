import { DashboardHeader } from '@/components/dashboard/header'
import { JobApplicationsList } from '@/components/dashboard/job-applications-list'

export default function ApplicationsPage () {
	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Job Applications</h1>
					<p className="text-blue-200">Track and manage your job applications</p>
				</div>
				<JobApplicationsList />
			</div>
		</div>
	)
}
