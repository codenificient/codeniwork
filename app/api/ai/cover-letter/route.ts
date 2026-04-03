import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { chatCompletion } from '@/lib/ai'
import { db } from '@/lib/db'
import { resumeParses, coverLetters } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST( request: NextRequest ) {
	try {
		const session = await auth()

		if ( !session?.user?.id ) {
			return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } )
		}

		const { resumeParseId, jobDescription, companyName, position, tone = 'professional', applicationId } = await request.json()

		if ( !resumeParseId || !jobDescription || !companyName || !position ) {
			return NextResponse.json(
				{ error: 'resumeParseId, jobDescription, companyName, and position are required' },
				{ status: 400 }
			)
		}

		const resumeParse = await db.query.resumeParses.findFirst( {
			where: eq( resumeParses.id, resumeParseId ),
		} )

		if ( !resumeParse || resumeParse.userId !== session.user.id ) {
			return NextResponse.json( { error: 'Resume parse not found' }, { status: 404 } )
		}

		const toneInstructions: Record<string, string> = {
			professional: 'Write in a formal, professional tone suitable for corporate environments.',
			casual: 'Write in a friendly, approachable tone while remaining professional.',
			enthusiastic: 'Write with energy and passion, showing genuine excitement about the opportunity.',
		}

		const content = await chatCompletion([
			{
				role: 'system',
				content: `You are an expert cover letter writer. ${toneInstructions[tone] || toneInstructions.professional} Write a compelling 3-4 paragraph cover letter. Reference specific skills matching the job. Include greeting and sign-off. Return ONLY the letter text.`,
			},
			{
				role: 'user',
				content: `CANDIDATE: ${resumeParse.name}\nSkills: ${(resumeParse.skills || []).join(', ')}\nSummary: ${resumeParse.summary}\n\nCOMPANY: ${companyName}\nPOSITION: ${position}\nJOB: ${jobDescription}`,
			},
		], { temperature: 0.7 })

		const [ coverLetter ] = await db.insert( coverLetters ).values( {
			userId: session.user.id,
			applicationId: applicationId || null,
			content,
			tone,
		} ).returning()

		return NextResponse.json( coverLetter )
	} catch ( error ) {
		console.error( 'Error generating cover letter:', error )
		return NextResponse.json(
			{ error: 'Failed to generate cover letter' },
			{ status: 500 }
		)
	}
}
