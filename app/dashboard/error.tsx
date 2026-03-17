'use client'

import { useEffect } from 'react'

export default function DashboardError ( {
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
} ) {
	useEffect( () => {
		console.error( 'Dashboard error:',error )
	},[ error ] )

	return (
		<div className="flex h-full items-center justify-center p-8">
			<div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
				<h2 className="mb-2 text-xl font-semibold text-white">Dashboard Error</h2>
				<p className="mb-6 text-sm text-gray-400">
					Something went wrong loading this page.
				</p>
				<button
					onClick={reset}
					className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
				>
					Try again
				</button>
			</div>
		</div>
	)
}
