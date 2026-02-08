export interface AnalyticsEvent {
	event: string
	properties?: Record<string, any>
	namespace?: string
	timestamp?: number
	userId?: string
}

export interface PageViewEvent extends AnalyticsEvent {
	event: "page-view"
	properties: {
		page: string
		title?: string
		referrer?: string
		url?: string
	}
}

export interface AuthenticationEvent extends AnalyticsEvent {
	event: "auth"
	properties: {
		action: "login" | "logout" | "register" | "password-reset"
		method?: string
		success: boolean
		page: string
		userId?: string
	}
}

export interface AnalyticsConfig {
	apiKey: string
	endpoint?: string
	debug?: boolean
	enabled?: boolean
	userId?: string
}

export type AppEvent = PageViewEvent | AuthenticationEvent
