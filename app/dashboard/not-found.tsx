import Link from 'next/link'

export default function DashboardNotFound () {
	return (
		<div className="flex h-full items-center justify-center p-8">
			<div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
				<h2 className="mb-2 text-4xl font-bold text-white">404</h2>
				<p className="mb-6 text-sm text-gray-400">
					This dashboard page doesn&apos;t exist.
				</p>
				<Link
					href="/dashboard"
					className="inline-block rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
				>
					Back to Dashboard
				</Link>
			</div>
		</div>
	)
}
