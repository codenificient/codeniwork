import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { jsonCompletion } from '@/lib/ai'
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

		const result = await jsonCompletion<{ questions: unknown[] }>([
			{
				role: 'system',
				content: 'You are an expert interview coach. Generate 10 interview questions with answer frameworks. Return JSON: { questions: [ { question, category (behavioral|technical|situational|general), difficulty (easy|medium|hard), answerFramework, tips } ] }',
			},
			{ role: 'user', content: `JOB DESCRIPTION:\n${jobDescription}${resumeContext}` },
		], { temperature: 0.4 })

		return NextResponse.json( result )
	} catch ( error ) {
		console.error( 'Error generating interview prep:', error )
		return NextResponse.json(
			{ error: 'Failed to generate interview prep' },
			{ status: 500 }
		)
	}
}
