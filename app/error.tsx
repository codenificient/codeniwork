'use client'

import { useEffect } from 'react'

export default function GlobalError ( {
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
} ) {
	useEffect( () => {
		console.error( 'Application error:',error )
	},[ error ] )

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
			<div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
				<h2 className="mb-2 text-xl font-semibold text-white">Something went wrong</h2>
				<p className="mb-6 text-sm text-gray-400">
					An unexpected error occurred. Please try again.
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
