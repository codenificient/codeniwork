import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getOpenAI } from '@/lib/openai'
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

		const completion = await getOpenAI().chat.completions.create( {
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `You are an expert cover letter writer. Generate a compelling, tailored cover letter. ${toneInstructions[tone] || toneInstructions.professional}

The letter should:
- Be 3-4 paragraphs
- Reference specific skills and experience from the resume that match the job
- Show knowledge of the company
- Include a strong opening and confident closing
- Be ready to send (include greeting and sign-off using the candidate's name)

Return ONLY the cover letter text, no JSON wrapping.`
				},
				{
					role: 'user',
					content: `CANDIDATE:
Name: ${resumeParse.name}
Skills: ${( resumeParse.skills || [] ).join( ', ' )}
Experience: ${JSON.stringify( resumeParse.experience )}
Summary: ${resumeParse.summary}

COMPANY: ${companyName}
POSITION: ${position}

JOB DESCRIPTION:
${jobDescription}`
				}
			],
			temperature: 0.7,
		} )

		const content = completion.choices[0].message.content || ''

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
