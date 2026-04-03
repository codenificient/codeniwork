import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { jsonCompletion } from '@/lib/ai'
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

		const result = await jsonCompletion<{
			matchScore?: number; matchedSkills?: string[]; missingSkills?: string[]; analysis?: string
		}>([
			{
				role: 'system',
				content: 'You are a job matching expert. Compare the resume against the job description. Return JSON with: matchScore (0-100), matchedSkills (array), missingSkills (array), analysis (3-5 sentences with actionable advice).',
			},
			{
				role: 'user',
				content: `RESUME:\nName: ${resumeParse.name}\nSkills: ${(resumeParse.skills || []).join(', ')}\nExperience: ${JSON.stringify(resumeParse.experience)}\nSummary: ${resumeParse.summary}\n\nJOB DESCRIPTION:\n${jobDescription}`,
			},
		], { temperature: 0.2 })

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
