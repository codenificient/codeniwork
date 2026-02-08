"use client"

import { getAnalytics } from "@/lib/analytics"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

function AnalyticsTracker() {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	useEffect( () => {
		const analytics = getAnalytics()
		if ( !analytics ) return

		const url = pathname + ( searchParams.toString() ? `?${searchParams.toString()}` : "" )
		analytics.pageView( url )
	}, [ pathname, searchParams ] )

	return null
}

export function AnalyticsProvider( { children }: { children: React.ReactNode } ) {
	return (
		<>
			<Suspense fallback={null}>
				<AnalyticsTracker />
			</Suspense>
			{children}
		</>
	)
}
