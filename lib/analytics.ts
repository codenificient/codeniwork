import { AnalyticsConfig, AppEvent } from "@/types/analytics"
import { Analytics } from "@codenificient/analytics-sdk"

class AppAnalytics {
	private analytics: Analytics | null = null
	private config: AnalyticsConfig
	private isInitialized = false

	constructor( config: AnalyticsConfig ) {
		this.config = config
		this.initialize()
	}

	private initialize() {
		if ( typeof window === "undefined" || !this.config.enabled ) return

		try {
			this.analytics = new Analytics( {
				apiKey: this.config.apiKey,
				endpoint: this.config.endpoint,
				debug: this.config.debug || false,
			} )
			this.isInitialized = true
		} catch ( error ) {
			console.error( "Failed to initialize analytics:", error )
		}
	}

	private async trackEvent( event: AppEvent ): Promise<void> {
		if ( !this.isInitialized ) return

		try {
			await fetch( "/api/analytics/track", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify( {
					namespace: event.namespace || "default",
					eventType: event.event,
					properties: event.properties,
				} ),
			} )
		} catch ( error ) {
			console.error( "Failed to track analytics event:", error )
		}
	}

	async pageView( page: string, title?: string, referrer?: string ): Promise<void> {
		await this.trackEvent( {
			event: "page-view",
			properties: {
				page,
				title: title || ( typeof document !== "undefined" ? document.title : "" ),
				referrer: referrer || ( typeof document !== "undefined" ? document.referrer : "" ),
				url: typeof window !== "undefined" ? window.location.href : "",
			},
			namespace: "pageview",
		} )
	}

	async authAction(
		action: "login" | "logout" | "register" | "password-reset",
		userId: string,
		method?: string,
		success: boolean = true
	): Promise<void> {
		await this.trackEvent( {
			event: "auth",
			properties: { action, method, success, userId, page: typeof window !== "undefined" ? window.location.pathname : "" },
			namespace: "authentication",
		} )
	}

	async custom( event: string, properties?: Record<string, any>, namespace?: string ): Promise<void> {
		if ( !this.isInitialized ) return
		await this.trackEvent( { event: event as any, properties: properties || {} as any, namespace: namespace || "custom" } )
	}

	isEnabled(): boolean {
		return this.isInitialized && this.config.enabled !== false
	}
}

let analyticsInstance: AppAnalytics | null = null

export function initializeAnalytics( config: AnalyticsConfig ): AppAnalytics {
	if ( !analyticsInstance ) {
		analyticsInstance = new AppAnalytics( config )
	}
	return analyticsInstance
}

export function getAnalytics(): AppAnalytics | null {
	return analyticsInstance
}

const defaultConfig: AnalyticsConfig = {
	apiKey: process.env.NEXT_PUBLIC_ANALYTICS_API_KEY || "",
	endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || "",
	debug: process.env.NODE_ENV === "development",
	enabled: process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
}

if ( typeof window !== "undefined" ) {
	initializeAnalytics( defaultConfig )
}

export { AppAnalytics }
