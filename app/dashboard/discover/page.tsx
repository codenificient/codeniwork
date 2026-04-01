'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
	Bookmark,
	BookmarkCheck,
	Briefcase,
	ExternalLink,
	Filter,
	Globe,
	Loader2,
	MapPin,
	RefreshCw,
	Search,
	X,
} from 'lucide-react'
import { useCallback,useEffect,useState } from 'react'

interface ExternalJob {
	id: string
	title: string
	company: string
	companyLogo: string|null
	url: string
	source: string
	description: string|null
	salaryMin: number|null
	salaryMax: number|null
	salaryCurrency: string|null
	location: string|null
	isRemote: boolean|null
	tags: string|null
	postedAt: string|null
	fetchedAt: string
	isSaved: boolean
}

const sourceLabels: Record<string, string>={
	remoteok: 'RemoteOK',
	adzuna: 'Adzuna',
	jsearch: 'JSearch',
}

const sourceColors: Record<string, string>={
	remoteok: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
	adzuna: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
	jsearch: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

export default function DiscoverPage () {
	const [ jobs,setJobs ]=useState<ExternalJob[]>( [] )
	const [ loading,setLoading ]=useState( true )
	const [ fetching,setFetching ]=useState( false )
	const [ search,setSearch ]=useState( '' )
	const [ source,setSource ]=useState( '' )
	const [ remoteOnly,setRemoteOnly ]=useState( false )
	const [ page,setPage ]=useState( 1 )
	const [ totalPages,setTotalPages ]=useState( 1 )
	const [ total,setTotal ]=useState( 0 )
	const [ selectedJob,setSelectedJob ]=useState<ExternalJob|null>( null )
	const [ showFilters,setShowFilters ]=useState( false )

	const loadJobs=useCallback( async () => {
		setLoading( true )
		try {
			const params=new URLSearchParams()
			if ( search ) params.set( 'search',search )
			if ( source ) params.set( 'source',source )
			if ( remoteOnly ) params.set( 'remote','true' )
			params.set( 'page',String( page ) )

			const res=await fetch( `/api/jobs?${params}` )
			if ( res.ok ) {
				const data=await res.json()
				setJobs( data.jobs )
				setTotalPages( data.totalPages )
				setTotal( data.total )
			}
		} catch ( error ) {
			console.error( 'Failed to load jobs:',error )
		} finally {
			setLoading( false )
		}
	},[ search,source,remoteOnly,page ] )

	useEffect( () => {
		loadJobs()
	},[ loadJobs ] )

	const handleFetchNew=async () => {
		setFetching( true )
		try {
			const res=await fetch( '/api/jobs/fetch',{ method: 'POST' } )
			if ( res.ok ) {
				const data=await res.json()
				alert( `Fetched ${data.inserted} new jobs from ${Object.entries( data.sources ).filter( ( [ ,v ] ) => ( v as number )>0 ).map( ( [ k,v ] ) => `${sourceLabels[ k ]||k}: ${v}` ).join( ', ' )||'no sources'}` )
				loadJobs()
			}
		} catch {
			alert( 'Failed to fetch jobs' )
		} finally {
			setFetching( false )
		}
	}

	const handleSave=async ( jobId: string,currentlySaved: boolean ) => {
		const res=await fetch( '/api/jobs/save',{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( { jobId,action: currentlySaved? 'unsave':'save' } ),
		} )
		if ( res.ok ) {
			setJobs( ( prev ) => prev.map( ( j ) => j.id===jobId? { ...j,isSaved: !currentlySaved }:j ) )
			if ( selectedJob?.id===jobId ) {
				setSelectedJob( ( prev ) => prev? { ...prev,isSaved: !currentlySaved }:null )
			}
		}
	}

	const handleQuickApply=async ( jobId: string ) => {
		if ( !confirm( 'Add this job to your applications tracker?' ) ) return
		const res=await fetch( '/api/jobs/save',{
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( { jobId } ),
		} )
		if ( res.ok ) {
			alert( 'Added to your applications!' )
		} else {
			alert( 'Failed to add application' )
		}
	}

	const formatSalary=( job: ExternalJob ) => {
		if ( !job.salaryMin&&!job.salaryMax ) return null
		const curr=job.salaryCurrency||'USD'
		if ( job.salaryMin&&job.salaryMax ) {
			return `${curr} ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}`
		}
		if ( job.salaryMin ) return `${curr} ${job.salaryMin.toLocaleString()}+`
		return `Up to ${curr} ${job.salaryMax!.toLocaleString()}`
	}

	const parseTags=( tags: string|null ): string[] => {
		if ( !tags ) return []
		try { return JSON.parse( tags ) } catch { return [] }
	}

	return (
		<div className="flex-1 min-h-screen">
			<div className="p-6 max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-white">Discover Jobs</h1>
						<p className="text-violet-200/60 text-sm mt-1">{total} jobs from multiple boards</p>
					</div>
					<Button
						onClick={handleFetchNew}
						disabled={fetching}
						className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
					>
						{fetching? <Loader2 className="w-4 h-4 mr-2 animate-spin" />:<RefreshCw className="w-4 h-4 mr-2" />}
						Fetch New Jobs
					</Button>
				</div>

				{/* Search & Filters */}
				<div className="mb-6 space-y-3">
					<div className="flex gap-3">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-300/50" />
							<input
								type="text"
								value={search}
								onChange={( e ) => { setSearch( e.target.value ); setPage( 1 ) }}
								placeholder="Search jobs by title or company..."
								className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder-violet-300/40 focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-sm"
							/>
						</div>
						<Button
							variant="ghost"
							onClick={() => setShowFilters( !showFilters )}
							className={cn(
								"text-violet-200 hover:bg-white/[0.06]",
								showFilters&&"bg-white/[0.08]"
							)}
						>
							<Filter className="w-4 h-4 mr-2" />
							Filters
						</Button>
					</div>

					{showFilters&&(
						<div className="flex gap-3 flex-wrap">
							<select
								value={source}
								onChange={( e ) => { setSource( e.target.value ); setPage( 1 ) }}
								className="px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
							>
								<option value="">All Sources</option>
								<option value="remoteok">RemoteOK</option>
								<option value="adzuna">Adzuna</option>
								<option value="jsearch">JSearch</option>
							</select>
							<button
								onClick={() => { setRemoteOnly( !remoteOnly ); setPage( 1 ) }}
								className={cn(
									"px-3 py-2 rounded-lg border text-sm transition-colors",
									remoteOnly
										? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
										:"bg-white/[0.06] border-white/[0.08] text-violet-200"
								)}
							>
								<Globe className="w-3.5 h-3.5 inline mr-1.5" />
								Remote Only
							</button>
							{( search||source||remoteOnly )&&(
								<button
									onClick={() => { setSearch( '' ); setSource( '' ); setRemoteOnly( false ); setPage( 1 ) }}
									className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-violet-300/60 text-sm hover:text-white transition-colors"
								>
									<X className="w-3.5 h-3.5 inline mr-1" />
									Clear
								</button>
							)}
						</div>
					)}
				</div>

				{/* Content */}
				<div className="flex gap-6">
					{/* Job List */}
					<div className="flex-1 space-y-3">
						{loading? (
							<div className="flex items-center justify-center py-20">
								<Loader2 className="w-6 h-6 animate-spin text-violet-400" />
							</div>
						):jobs.length===0? (
							<div className="text-center py-20">
								<Briefcase className="w-12 h-12 mx-auto text-violet-300/30 mb-3" />
								<p className="text-violet-200/60">No jobs found. Try fetching new jobs or adjusting filters.</p>
							</div>
						):(
							<>
								{jobs.map( ( job ) => (
									<button
										key={job.id}
										onClick={() => setSelectedJob( job )}
										className={cn(
											"w-full text-left p-4 rounded-xl border transition-all duration-200",
											selectedJob?.id===job.id
												? "bg-white/[0.08] border-violet-500/30 shadow-lg shadow-violet-500/5"
												:"bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
										)}
									>
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<h3 className="text-white font-medium text-sm truncate">{job.title}</h3>
													<span className={cn( "text-[10px] px-1.5 py-0.5 rounded-full border",sourceColors[ job.source ]||'bg-gray-500/20 text-gray-300' )}>
														{sourceLabels[ job.source ]||job.source}
													</span>
												</div>
												<p className="text-violet-200/70 text-xs mb-2">{job.company}</p>
												<div className="flex items-center gap-3 text-[11px] text-violet-300/50">
													{job.location&&(
														<span className="flex items-center gap-1">
															<MapPin className="w-3 h-3" />{job.location}
														</span>
													)}
													{job.isRemote&&(
														<span className="flex items-center gap-1 text-emerald-400/70">
															<Globe className="w-3 h-3" />Remote
														</span>
													)}
													{formatSalary( job )&&(
														<span className="text-green-400/70">{formatSalary( job )}</span>
													)}
												</div>
											</div>
											<button
												onClick={( e ) => { e.stopPropagation(); handleSave( job.id,job.isSaved ) }}
												className="p-1.5 hover:bg-white/[0.08] rounded-lg transition-colors"
											>
												{job.isSaved
													? <BookmarkCheck className="w-4 h-4 text-violet-400" />
													:<Bookmark className="w-4 h-4 text-violet-300/40" />
												}
											</button>
										</div>
									</button>
								) )}

								{/* Pagination */}
								{totalPages>1&&(
									<div className="flex items-center justify-center gap-2 pt-4">
										<Button
											variant="ghost"
											size="sm"
											disabled={page===1}
											onClick={() => setPage( page-1 )}
											className="text-violet-200 hover:bg-white/[0.06]"
										>
											Previous
										</Button>
										<span className="text-violet-200/60 text-sm px-3">
											Page {page} of {totalPages}
										</span>
										<Button
											variant="ghost"
											size="sm"
											disabled={page===totalPages}
											onClick={() => setPage( page+1 )}
											className="text-violet-200 hover:bg-white/[0.06]"
										>
											Next
										</Button>
									</div>
								)}
							</>
						)}
					</div>

					{/* Job Detail Panel */}
					{selectedJob&&(
						<div className="w-[420px] shrink-0 sticky top-6 self-start">
							<div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 space-y-4">
								<div className="flex items-start justify-between">
									<div className="flex-1 min-w-0">
										<h2 className="text-lg font-semibold text-white mb-1">{selectedJob.title}</h2>
										<p className="text-violet-200/80 text-sm">{selectedJob.company}</p>
									</div>
									<button
										onClick={() => setSelectedJob( null )}
										className="p-1 hover:bg-white/[0.08] rounded-lg"
									>
										<X className="w-4 h-4 text-violet-300/50" />
									</button>
								</div>

								<div className="flex flex-wrap gap-2">
									<span className={cn( "text-xs px-2 py-1 rounded-full border",sourceColors[ selectedJob.source ] )}>
										{sourceLabels[ selectedJob.source ]||selectedJob.source}
									</span>
									{selectedJob.isRemote&&(
										<span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
											Remote
										</span>
									)}
									{selectedJob.location&&(
										<span className="text-xs px-2 py-1 rounded-full bg-white/[0.06] text-violet-200/70 border border-white/[0.08]">
											<MapPin className="w-3 h-3 inline mr-1" />{selectedJob.location}
										</span>
									)}
								</div>

								{formatSalary( selectedJob )&&(
									<div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
										<p className="text-green-300 text-sm font-medium">{formatSalary( selectedJob )}</p>
									</div>
								)}

								{parseTags( selectedJob.tags ).length>0&&(
									<div className="flex flex-wrap gap-1.5">
										{parseTags( selectedJob.tags ).slice( 0,8 ).map( ( tag ) => (
											<span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300/80 border border-violet-500/15">
												{tag}
											</span>
										) )}
									</div>
								)}

								{selectedJob.description&&(
									<div className="max-h-60 overflow-y-auto pr-2">
										<p className="text-violet-200/60 text-xs leading-relaxed whitespace-pre-line">
											{selectedJob.description.slice( 0,1000 )}
											{selectedJob.description.length>1000&&'...'}
										</p>
									</div>
								)}

								{selectedJob.postedAt&&(
									<p className="text-violet-300/40 text-xs">
										Posted {formatDistanceToNow( new Date( selectedJob.postedAt ),{ addSuffix: true } )}
									</p>
								)}

								<div className="flex gap-2 pt-2 border-t border-white/[0.06]">
									<Button
										onClick={() => handleQuickApply( selectedJob.id )}
										className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm"
									>
										<Briefcase className="w-3.5 h-3.5 mr-1.5" />
										Quick Apply
									</Button>
									<Button
										onClick={() => handleSave( selectedJob.id,selectedJob.isSaved )}
										variant="ghost"
										className={cn(
											"border text-sm",
											selectedJob.isSaved
												? "border-violet-500/30 text-violet-300 bg-violet-500/10"
												:"border-white/[0.08] text-violet-200 hover:bg-white/[0.06]"
										)}
									>
										{selectedJob.isSaved? <BookmarkCheck className="w-3.5 h-3.5 mr-1.5" />:<Bookmark className="w-3.5 h-3.5 mr-1.5" />}
										{selectedJob.isSaved? 'Saved':'Save'}
									</Button>
									<a
										href={selectedJob.url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-white/[0.08] text-violet-200 hover:bg-white/[0.06] transition-colors"
									>
										<ExternalLink className="w-3.5 h-3.5" />
									</a>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
