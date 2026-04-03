import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getOpenAI } from '@/lib/openai'
import { db } from '@/lib/db'
import { resumeParses } from '@/lib/db/schema'

export async function POST( request: NextRequest ) {
	try {
		const session = await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } )
		}

		const { text } = await request.json()

		if ( !text || typeof text !== 'string' ) {
			return NextResponse.json( { error: 'Resume text is required' }, { status: 400 } )
		}

		const completion = await getOpenAI().chat.completions.create( {
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are a resume parser. Extract structured data from the resume text provided. Return valid JSON with these fields:
- name (string)
- email (string)
- phone (string)
- summary (string, 2-3 sentence professional summary)
- skills (string array)
- experience (array of objects with: title, company, duration, description)
- education (array of objects with: degree, school, year)

Return ONLY valid JSON, no markdown or extra text.`
				},
				{
					role: 'user',
					content: text
				}
			],
			temperature: 0.1,
			response_format: { type: 'json_object' },
		} )

		const parsed = JSON.parse( completion.choices[0].message.content || '{}' )

		const [ resumeParse ] = await db.insert( resumeParses ).values( {
			userId: session.user.id,
			rawText: text,
			name: parsed.name || null,
			email: parsed.email || null,
			phone: parsed.phone || null,
			summary: parsed.summary || null,
			skills: parsed.skills || [],
			experience: parsed.experience || [],
			education: parsed.education || [],
		} ).returning()

		return NextResponse.json( resumeParse )
	} catch ( error ) {
		console.error( 'Error parsing resume:', error )
		return NextResponse.json(
			{ error: 'Failed to parse resume' },
			{ status: 500 }
		)
	}
}
