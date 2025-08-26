import { Sidebar } from '@/components/ui/sidebar'

export default function DashboardLayout ( {
	children,
}: {
	children: React.ReactNode
} ) {
	return (
		<div className="flex h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
			<Sidebar />
			<main className="flex-1 overflow-auto">
				{children}
			</main>
		</div>
	)
}
