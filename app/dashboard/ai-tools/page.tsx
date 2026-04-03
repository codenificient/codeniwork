'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Brain, FileText, Target, MessageSquare, Sparkles, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface ResumeParseResult {
	id: string
	name: string | null
	email: string | null
	phone: string | null
	summary: string | null
	skills: string[] | null
	experience: { title: string; company: string; duration: string; description: string }[]
	education: { degree: string; school: string; year: string }[]
}

interface MatchResult {
	matchScore: number
	matchedSkills: string[] | null
	missingSkills: string[] | null
	aiAnalysis: string | null
}

interface CoverLetterResult {
	id: string
	content: string
	tone: string
}

interface InterviewQuestion {
	question: string
	category: string
	difficulty: string
	answerFramework: string
	tips: string
}

function ScoreBadge( { score }: { score: number } ) {
	const color = score >= 70
		? 'from-emerald-500 to-green-500'
		: score >= 40
			? 'from-amber-500 to-yellow-500'
			: 'from-red-500 to-rose-500'
	return (
		<div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white font-bold text-lg`}>
			{score}/100
		</div>
	)
}

function SectionCard( { title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode } ) {
	return (
		<div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
			<div className="flex items-center gap-3 mb-4">
				<div className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600">
					<Icon className="w-5 h-5 text-white" />
				</div>
				<h2 className="text-lg font-semibold text-white">{title}</h2>
			</div>
			{children}
		</div>
	)
}

export default function AIToolsPage() {
	const [ resumeText, setResumeText ] = useState( '' )
	const [ parsedResume, setParsedResume ] = useState<ResumeParseResult | null>( null )
	const [ parsing, setParsing ] = useState( false )

	const [ jobDesc, setJobDesc ] = useState( '' )
	const [ matchResult, setMatchResult ] = useState<MatchResult | null>( null )
	const [ scoring, setScoring ] = useState( false )

	const [ coverLetterJobDesc, setCoverLetterJobDesc ] = useState( '' )
	const [ companyName, setCompanyName ] = useState( '' )
	const [ position, setPosition ] = useState( '' )
	const [ tone, setTone ] = useState( 'professional' )
	const [ coverLetter, setCoverLetter ] = useState<CoverLetterResult | null>( null )
	const [ generating, setGenerating ] = useState( false )
	const [ copied, setCopied ] = useState( false )

	const [ interviewJobDesc, setInterviewJobDesc ] = useState( '' )
	const [ questions, setQuestions ] = useState<InterviewQuestion[]>( [] )
	const [ prepping, setPrepping ] = useState( false )
	const [ expandedQ, setExpandedQ ] = useState<number | null>( null )

	async function handleParseResume() {
		if ( !resumeText.trim() ) return
		setParsing( true )
		try {
			const res = await fetch( '/api/ai/parse-resume', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( { text: resumeText } ),
			} )
			if ( !res.ok ) throw new Error( 'Failed to parse' )
			const data = await res.json()
			setParsedResume( data )
		} catch {
			alert( 'Failed to parse resume. Please try again.' )
		} finally {
			setParsing( false )
		}
	}

	async function handleScoreMatch() {
		if ( !jobDesc.trim() || !parsedResume ) return
		setScoring( true )
		try {
			const res = await fetch( '/api/ai/score-match', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( { resumeParseId: parsedResume.id, jobDescription: jobDesc } ),
			} )
			if ( !res.ok ) throw new Error( 'Failed to score' )
			const data = await res.json()
			setMatchResult( data )
		} catch {
			alert( 'Failed to score match. Please try again.' )
		} finally {
			setScoring( false )
		}
	}

	async function handleGenerateCoverLetter() {
		if ( !coverLetterJobDesc.trim() || !companyName.trim() || !position.trim() || !parsedResume ) return
		setGenerating( true )
		try {
			const res = await fetch( '/api/ai/cover-letter', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( {
					resumeParseId: parsedResume.id,
					jobDescription: coverLetterJobDesc,
					companyName,
					position,
					tone,
				} ),
			} )
			if ( !res.ok ) throw new Error( 'Failed to generate' )
			const data = await res.json()
			setCoverLetter( data )
		} catch {
			alert( 'Failed to generate cover letter. Please try again.' )
		} finally {
			setGenerating( false )
		}
	}

	async function handleInterviewPrep() {
		if ( !interviewJobDesc.trim() ) return
		setPrepping( true )
		try {
			const res = await fetch( '/api/ai/interview-prep', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( {
					jobDescription: interviewJobDesc,
					resumeParseId: parsedResume?.id,
				} ),
			} )
			if ( !res.ok ) throw new Error( 'Failed to prep' )
			const data = await res.json()
			setQuestions( data.questions || [] )
		} catch {
			alert( 'Failed to generate interview prep. Please try again.' )
		} finally {
			setPrepping( false )
		}
	}

	function handleCopy( text: string ) {
		navigator.clipboard.writeText( text )
		setCopied( true )
		setTimeout( () => setCopied( false ), 2000 )
	}

	return (
		<div className="p-6 max-w-4xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600">
					<Sparkles className="w-6 h-6 text-white" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-white">AI Tools</h1>
					<p className="text-violet-200/70 text-sm">AI-powered resume parsing, job matching, and interview prep</p>
				</div>
			</div>

			{/* Parse Resume */}
			<SectionCard title="Parse Resume" icon={FileText}>
				<textarea
					value={resumeText}
					onChange={( e ) => setResumeText( e.target.value )}
					placeholder="Paste your resume text here..."
					className="w-full h-40 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-violet-500/50"
				/>
				<Button
					onClick={handleParseResume}
					disabled={parsing || !resumeText.trim()}
					className="mt-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
				>
					{parsing ? 'Parsing...' : 'Parse Resume'}
				</Button>

				{parsedResume && (
					<div className="mt-4 space-y-3">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							{parsedResume.name && (
								<div className="bg-white/[0.04] rounded-lg p-3">
									<span className="text-violet-300/70 text-xs">Name</span>
									<p className="text-white text-sm">{parsedResume.name}</p>
								</div>
							)}
							{parsedResume.email && (
								<div className="bg-white/[0.04] rounded-lg p-3">
									<span className="text-violet-300/70 text-xs">Email</span>
									<p className="text-white text-sm">{parsedResume.email}</p>
								</div>
							)}
							{parsedResume.phone && (
								<div className="bg-white/[0.04] rounded-lg p-3">
									<span className="text-violet-300/70 text-xs">Phone</span>
									<p className="text-white text-sm">{parsedResume.phone}</p>
								</div>
							)}
						</div>
						{parsedResume.summary && (
							<div className="bg-white/[0.04] rounded-lg p-3">
								<span className="text-violet-300/70 text-xs">Summary</span>
								<p className="text-white/90 text-sm mt-1">{parsedResume.summary}</p>
							</div>
						)}
						{parsedResume.skills && parsedResume.skills.length > 0 && (
							<div>
								<span className="text-violet-300/70 text-xs">Skills</span>
								<div className="flex flex-wrap gap-2 mt-1">
									{parsedResume.skills.map( ( skill, i ) => (
										<span key={i} className="px-2.5 py-1 bg-violet-500/20 text-violet-200 rounded-full text-xs">
											{skill}
										</span>
									) )}
								</div>
							</div>
						)}
						{parsedResume.experience && parsedResume.experience.length > 0 && (
							<div>
								<span className="text-violet-300/70 text-xs">Experience</span>
								<div className="space-y-2 mt-1">
									{parsedResume.experience.map( ( exp, i ) => (
										<div key={i} className="bg-white/[0.04] rounded-lg p-3">
											<p className="text-white text-sm font-medium">{exp.title} at {exp.company}</p>
											<p className="text-violet-200/60 text-xs">{exp.duration}</p>
										</div>
									) )}
								</div>
							</div>
						)}
					</div>
				)}
			</SectionCard>

			{/* Score a Job Match */}
			<SectionCard title="Score a Job Match" icon={Target}>
				{!parsedResume ? (
					<p className="text-white/40 text-sm">Parse your resume first to use job matching.</p>
				) : (
					<>
						<textarea
							value={jobDesc}
							onChange={( e ) => setJobDesc( e.target.value )}
							placeholder="Paste the job description here..."
							className="w-full h-32 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-violet-500/50"
						/>
						<Button
							onClick={handleScoreMatch}
							disabled={scoring || !jobDesc.trim()}
							className="mt-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
						>
							{scoring ? 'Scoring...' : 'Score Match'}
						</Button>

						{matchResult && (
							<div className="mt-4 space-y-3">
								<div className="flex items-center gap-4">
									<ScoreBadge score={matchResult.matchScore} />
									<span className="text-white/70 text-sm">Match Score</span>
								</div>
								{matchResult.matchedSkills && matchResult.matchedSkills.length > 0 && (
									<div>
										<span className="text-emerald-400 text-xs font-medium">Matched Skills</span>
										<div className="flex flex-wrap gap-2 mt-1">
											{matchResult.matchedSkills.map( ( skill, i ) => (
												<span key={i} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-xs">
													{skill}
												</span>
											) )}
										</div>
									</div>
								)}
								{matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
									<div>
										<span className="text-red-400 text-xs font-medium">Missing Skills</span>
										<div className="flex flex-wrap gap-2 mt-1">
											{matchResult.missingSkills.map( ( skill, i ) => (
												<span key={i} className="px-2.5 py-1 bg-red-500/20 text-red-200 rounded-full text-xs">
													{skill}
												</span>
											) )}
										</div>
									</div>
								)}
								{matchResult.aiAnalysis && (
									<div className="bg-white/[0.04] rounded-lg p-3">
										<span className="text-violet-300/70 text-xs">Analysis</span>
										<p className="text-white/90 text-sm mt-1">{matchResult.aiAnalysis}</p>
									</div>
								)}
							</div>
						)}
					</>
				)}
			</SectionCard>

			{/* Generate Cover Letter */}
			<SectionCard title="Generate Cover Letter" icon={MessageSquare}>
				{!parsedResume ? (
					<p className="text-white/40 text-sm">Parse your resume first to generate cover letters.</p>
				) : (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<input
								type="text"
								value={companyName}
								onChange={( e ) => setCompanyName( e.target.value )}
								placeholder="Company name"
								className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
							/>
							<input
								type="text"
								value={position}
								onChange={( e ) => setPosition( e.target.value )}
								placeholder="Position title"
								className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
							/>
						</div>
						<textarea
							value={coverLetterJobDesc}
							onChange={( e ) => setCoverLetterJobDesc( e.target.value )}
							placeholder="Paste the job description here..."
							className="w-full h-32 mt-3 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-violet-500/50"
						/>
						<div className="flex items-center gap-3 mt-3">
							<select
								value={tone}
								onChange={( e ) => setTone( e.target.value )}
								className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500/50"
							>
								<option value="professional" className="bg-gray-900">Professional</option>
								<option value="casual" className="bg-gray-900">Casual</option>
								<option value="enthusiastic" className="bg-gray-900">Enthusiastic</option>
							</select>
							<Button
								onClick={handleGenerateCoverLetter}
								disabled={generating || !coverLetterJobDesc.trim() || !companyName.trim() || !position.trim()}
								className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
							>
								{generating ? 'Generating...' : 'Generate'}
							</Button>
						</div>

						{coverLetter && (
							<div className="mt-4">
								<div className="flex items-center justify-between mb-2">
									<span className="text-violet-300/70 text-xs">Generated Cover Letter</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleCopy( coverLetter.content )}
										className="text-violet-200/70 hover:text-white"
									>
										{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
										<span className="ml-1 text-xs">{copied ? 'Copied!' : 'Copy'}</span>
									</Button>
								</div>
								<div className="bg-white/[0.04] rounded-lg p-4 text-white/90 text-sm whitespace-pre-wrap">
									{coverLetter.content}
								</div>
							</div>
						)}
					</>
				)}
			</SectionCard>

			{/* Interview Prep */}
			<SectionCard title="Interview Prep" icon={Brain}>
				<textarea
					value={interviewJobDesc}
					onChange={( e ) => setInterviewJobDesc( e.target.value )}
					placeholder="Paste the job description here..."
					className="w-full h-32 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-violet-500/50"
				/>
				<Button
					onClick={handleInterviewPrep}
					disabled={prepping || !interviewJobDesc.trim()}
					className="mt-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
				>
					{prepping ? 'Generating...' : 'Generate Questions'}
				</Button>

				{questions.length > 0 && (
					<div className="mt-4 space-y-2">
						{questions.map( ( q, i ) => (
							<div key={i} className="bg-white/[0.04] rounded-lg border border-white/[0.06]">
								<button
									onClick={() => setExpandedQ( expandedQ === i ? null : i )}
									className="w-full flex items-center justify-between p-3 text-left"
								>
									<div className="flex items-center gap-3">
										<span className="text-violet-400 font-mono text-xs">Q{i + 1}</span>
										<span className="text-white text-sm">{q.question}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className={`px-2 py-0.5 rounded-full text-xs ${
											q.difficulty === 'hard'
												? 'bg-red-500/20 text-red-300'
												: q.difficulty === 'medium'
													? 'bg-amber-500/20 text-amber-300'
													: 'bg-emerald-500/20 text-emerald-300'
										}`}>
											{q.difficulty}
										</span>
										<span className="px-2 py-0.5 bg-white/[0.06] rounded-full text-xs text-violet-200/70">
											{q.category}
										</span>
										{expandedQ === i ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
									</div>
								</button>
								{expandedQ === i && (
									<div className="px-3 pb-3 space-y-2 border-t border-white/[0.06] pt-3">
										<div>
											<span className="text-violet-300/70 text-xs">Answer Framework</span>
											<p className="text-white/80 text-sm mt-1">{q.answerFramework}</p>
										</div>
										{q.tips && (
											<div>
												<span className="text-violet-300/70 text-xs">Tips</span>
												<p className="text-white/80 text-sm mt-1">{q.tips}</p>
											</div>
										)}
									</div>
								)}
							</div>
						) )}
					</div>
				)}
			</SectionCard>
		</div>
	)
}
