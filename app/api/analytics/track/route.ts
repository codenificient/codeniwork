import type { AnalyticsResponse, EventData } from "@codenificient/analytics-sdk"
import { NextRequest, NextResponse } from "next/server"

const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || ""
const API_KEY = process.env.NEXT_PUBLIC_ANALYTICS_API_KEY || ""

interface AnalyticsRequestPayload {
	events?: EventData[]
	namespace?: string
	eventType?: string
	properties?: Record<string, unknown>
	page?: string
}

interface AnalyticsApiPayload {
	apiKey: string
	events: EventData[]
}

export async function POST( request: NextRequest ) {
	try {
		const body: AnalyticsRequestPayload = await request.json()
		const { events, namespace, eventType, properties, page } = body

		if ( !events && !namespace && !eventType && !page ) {
			return NextResponse.json( { error: "Missing required fields" }, { status: 400 } )
		}

		const analyticsPayload: AnalyticsApiPayload = {
			apiKey: API_KEY,
			events: [],
		}

		if ( events ) {
			analyticsPayload.events = events
		} else if ( namespace && eventType ) {
			analyticsPayload.events = [ { namespace, eventType, properties: properties || {} } ]
		} else if ( page ) {
			analyticsPayload.events = [ { namespace: "pageview", eventType: "view", properties: { page, ...properties } } ]
		}

		const headers: HeadersInit = {
			"Content-Type": "application/json",
			"User-Agent": "CodeniWork/1.0",
			Accept: "application/json",
		}

		const response = await fetch( `${ANALYTICS_ENDPOINT}/events`, {
			method: "POST",
			headers,
			body: JSON.stringify( analyticsPayload ),
		} )

		if ( !response.ok ) {
			const errorText = await response.text()
			console.error( "Analytics API error:", response.status, errorText )
			return NextResponse.json( { error: "Analytics request failed" }, { status: response.status } )
		}

		const data: AnalyticsResponse = await response.json()
		return NextResponse.json( data )
	} catch ( error ) {
		console.error( "Analytics API error:", error )
		return NextResponse.json( { error: "Internal server error" }, { status: 500 } )
	}
}
