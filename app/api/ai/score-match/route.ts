import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getOpenAI } from '@/lib/openai'
import { db } from '@/lib/db'
import { resumeParses, jobMatches } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST( request: NextRequest ) {
	try {
		const session = await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } )
		}

		const { resumeParseId, jobDescription, applicationId } = await request.json()

		if ( !resumeParseId || !jobDescription ) {
			return NextResponse.json(
				{ error: 'resumeParseId and jobDescription are required' },
				{ status: 400 }
			)
		}

		const resumeParse = await db.query.resumeParses.findFirst( {
			where: eq( resumeParses.id, resumeParseId ),
		} )

		if ( !resumeParse || resumeParse.userId !== session.user.id ) {
			return NextResponse.json( { error: 'Resume parse not found' }, { status: 404 } )
		}

		const completion = await getOpenAI().chat.completions.create( {
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are a job matching expert. Compare the candidate's resume against the job description and provide a match analysis. Return valid JSON with these fields:
- matchScore (integer 0-100)
- matchedSkills (string array of skills the candidate has that match the job)
- missingSkills (string array of required skills the candidate lacks)
- analysis (string, 3-5 sentence analysis of the match quality with actionable advice)

Return ONLY valid JSON, no markdown or extra text.`
				},
				{
					role: 'user',
					content: `RESUME DATA:
Name: ${resumeParse.name}
Skills: ${( resumeParse.skills || [] ).join( ', ' )}
Experience: ${JSON.stringify( resumeParse.experience )}
Education: ${JSON.stringify( resumeParse.education )}
Summary: ${resumeParse.summary}

JOB DESCRIPTION:
${jobDescription}`
				}
			],
			temperature: 0.2,
			response_format: { type: 'json_object' },
		} )

		const result = JSON.parse( completion.choices[0].message.content || '{}' )

		const [ jobMatch ] = await db.insert( jobMatches ).values( {
			userId: session.user.id,
			applicationId: applicationId || null,
			resumeParseId,
			jobDescription,
			matchScore: result.matchScore || 0,
			matchedSkills: result.matchedSkills || [],
			missingSkills: result.missingSkills || [],
			aiAnalysis: result.analysis || '',
		} ).returning()

		return NextResponse.json( jobMatch )
	} catch ( error ) {
		console.error( 'Error scoring match:', error )
		return NextResponse.json(
			{ error: 'Failed to score job match' },
			{ status: 500 }
		)
	}
}
