import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getOpenAI } from '@/lib/openai'
import { db } from '@/lib/db'
import { resumeParses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST( request: NextRequest ) {
	try {
		const session = await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } )
		}

		const { jobDescription, resumeParseId } = await request.json()

		if ( !jobDescription ) {
			return NextResponse.json(
				{ error: 'jobDescription is required' },
				{ status: 400 }
			)
		}

		let resumeContext = ''
		if ( resumeParseId ) {
			const resumeParse = await db.query.resumeParses.findFirst( {
				where: eq( resumeParses.id, resumeParseId ),
			} )
			if ( resumeParse && resumeParse.userId === session.user.id ) {
				resumeContext = `
CANDIDATE BACKGROUND:
Skills: ${( resumeParse.skills || [] ).join( ', ' )}
Experience: ${JSON.stringify( resumeParse.experience )}
Summary: ${resumeParse.summary}`
			}
		}

		const completion = await getOpenAI().chat.completions.create( {
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are an expert interview coach. Generate 10 likely interview questions for the given job description, along with ideal answer frameworks. Return valid JSON with this structure:
{
  "questions": [
    {
      "question": "...",
      "category": "behavioral" | "technical" | "situational" | "general",
      "difficulty": "easy" | "medium" | "hard",
      "answerFramework": "...",
      "tips": "..."
    }
  ]
}

For answerFramework, provide a structured approach (e.g., STAR method outline, key points to cover) rather than a scripted answer. If candidate background is provided, tailor the frameworks to their specific experience.

Return ONLY valid JSON, no markdown or extra text.`
				},
				{
					role: 'user',
					content: `JOB DESCRIPTION:
${jobDescription}
${resumeContext}`
				}
			],
			temperature: 0.4,
			response_format: { type: 'json_object' },
		} )

		const result = JSON.parse( completion.choices[0].message.content || '{"questions":[]}' )

		return NextResponse.json( result )
	} catch ( error ) {
		console.error( 'Error generating interview prep:', error )
		return NextResponse.json(
			{ error: 'Failed to generate interview prep' },
			{ status: 500 }
		)
	}
}
