export default function RootLoading () {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
			<div className="flex flex-col items-center gap-4">
				<div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
				<p className="text-sm text-gray-400">Loading CodeniWork...</p>
			</div>
		</div>
	)
}
