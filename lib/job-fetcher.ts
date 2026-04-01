import { db } from '@/lib/db'
import { externalJobs } from '@/lib/db/schema'
import { and,eq } from 'drizzle-orm'

// Normalized job shape from any source
export interface NormalizedJob {
	title: string
	company: string
	companyLogo?: string
	url: string
	source: string
	sourceId?: string
	description?: string
	salaryMin?: number
	salaryMax?: number
	salaryCurrency?: string
	location?: string
	isRemote?: boolean
	tags?: string[]
	postedAt?: Date
}

// --- RemoteOK ---
interface RemoteOKJob {
	id: string
	epoch: number
	company: string
	company_logo: string
	position: string
	tags: string[]
	description: string
	location: string
	salary_min: number
	salary_max: number
	url: string
	apply_url: string
}

async function fetchRemoteOK (): Promise<NormalizedJob[]> {
	try {
		const res=await fetch( 'https://remoteok.com/api',{
			headers: { 'User-Agent': 'CodeniWork/1.0' },
			next: { revalidate: 3600 },
		} )
		if ( !res.ok ) return []

		const data: RemoteOKJob[]=await res.json()
		// First element is metadata, skip it
		const jobs=data.slice( 1 )

		return jobs.map( ( job ) => ( {
			title: job.position||'Untitled',
			company: job.company||'Unknown',
			companyLogo: job.company_logo||undefined,
			url: job.apply_url||job.url||`https://remoteok.com/remote-jobs/${job.id}`,
			source: 'remoteok',
			sourceId: String( job.id ),
			description: job.description||undefined,
			salaryMin: job.salary_min||undefined,
			salaryMax: job.salary_max||undefined,
			salaryCurrency: 'USD',
			location: job.location||'Remote',
			isRemote: true,
			tags: job.tags||[],
			postedAt: job.epoch? new Date( job.epoch*1000 ):undefined,
		} ) )
	} catch ( error ) {
		console.error( 'RemoteOK fetch error:',error )
		return []
	}
}

// --- Adzuna ---
interface AdzunaJob {
	id: string
	title: string
	company: { display_name: string }
	redirect_url: string
	description: string
	location: { display_name: string; area: string[] }
	salary_min: number
	salary_max: number
	created: string
	category: { tag: string; label: string }
}

async function fetchAdzuna (): Promise<NormalizedJob[]> {
	const appId=process.env.ADZUNA_APP_ID
	const appKey=process.env.ADZUNA_APP_KEY
	if ( !appId||!appKey ) return []

	try {
		const res=await fetch(
			`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=developer+engineer&content-type=application/json`,
			{ next: { revalidate: 3600 } }
		)
		if ( !res.ok ) return []

		const data=await res.json()
		const jobs: AdzunaJob[]=data.results||[]

		return jobs.map( ( job ) => ( {
			title: job.title||'Untitled',
			company: job.company?.display_name||'Unknown',
			url: job.redirect_url,
			source: 'adzuna',
			sourceId: String( job.id ),
			description: job.description||undefined,
			salaryMin: job.salary_min? Math.round( job.salary_min ):undefined,
			salaryMax: job.salary_max? Math.round( job.salary_max ):undefined,
			salaryCurrency: 'USD',
			location: job.location?.display_name||undefined,
			isRemote: ( job.title+' '+( job.location?.display_name||'' ) ).toLowerCase().includes( 'remote' ),
			tags: job.category? [ job.category.label ]:[],
			postedAt: job.created? new Date( job.created ):undefined,
		} ) )
	} catch ( error ) {
		console.error( 'Adzuna fetch error:',error )
		return []
	}
}

// --- JSearch (RapidAPI) ---
interface JSearchJob {
	job_id: string
	job_title: string
	employer_name: string
	employer_logo: string
	job_apply_link: string
	job_description: string
	job_city: string
	job_state: string
	job_country: string
	job_min_salary: number
	job_max_salary: number
	job_salary_currency: string
	job_is_remote: boolean
	job_posted_at_datetime_utc: string
	job_required_skills: string[]
}

async function fetchJSearch (): Promise<NormalizedJob[]> {
	const apiKey=process.env.RAPIDAPI_KEY
	if ( !apiKey ) return []

	try {
		const res=await fetch(
			'https://jsearch.p.rapidapi.com/search?query=software+developer&num_pages=1&page=1',
			{
				headers: {
					'X-RapidAPI-Key': apiKey,
					'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
				},
				next: { revalidate: 3600 },
			}
		)
		if ( !res.ok ) return []

		const data=await res.json()
		const jobs: JSearchJob[]=data.data||[]

		return jobs.map( ( job ) => ( {
			title: job.job_title||'Untitled',
			company: job.employer_name||'Unknown',
			companyLogo: job.employer_logo||undefined,
			url: job.job_apply_link,
			source: 'jsearch',
			sourceId: job.job_id,
			description: job.job_description||undefined,
			salaryMin: job.job_min_salary? Math.round( job.job_min_salary ):undefined,
			salaryMax: job.job_max_salary? Math.round( job.job_max_salary ):undefined,
			salaryCurrency: job.job_salary_currency||'USD',
			location: [ job.job_city,job.job_state,job.job_country ].filter( Boolean ).join( ', ' )||undefined,
			isRemote: job.job_is_remote||false,
			tags: job.job_required_skills||[],
			postedAt: job.job_posted_at_datetime_utc? new Date( job.job_posted_at_datetime_utc ):undefined,
		} ) )
	} catch ( error ) {
		console.error( 'JSearch fetch error:',error )
		return []
	}
}

// --- Deduplication ---
function deduplicateJobs ( jobs: NormalizedJob[] ): NormalizedJob[] {
	const seen=new Map<string, NormalizedJob>()
	for ( const job of jobs ) {
		const key=`${job.title.toLowerCase().trim()}::${job.company.toLowerCase().trim()}`
		if ( !seen.has( key ) ) {
			seen.set( key,job )
		}
	}
	return Array.from( seen.values() )
}

// --- Match scoring ---
export function computeMatchScore ( job: NormalizedJob,preferences?: { keywords?: string[]; remoteOnly?: boolean; minSalary?: number } ): number {
	if ( !preferences ) return 50 // Default score

	let score=50
	const titleAndDesc=( ( job.title||'' )+' '+( job.description||'' )+' '+( job.tags||[] ).join( ' ' ) ).toLowerCase()

	// Keyword matching (+10 per matched keyword, up to +30)
	if ( preferences.keywords?.length ) {
		let keywordMatches=0
		for ( const kw of preferences.keywords ) {
			if ( titleAndDesc.includes( kw.toLowerCase() ) ) keywordMatches++
		}
		score+=Math.min( keywordMatches*10,30 )
	}

	// Remote preference (+10)
	if ( preferences.remoteOnly&&job.isRemote ) {
		score+=10
	}

	// Salary match (+10)
	if ( preferences.minSalary&&job.salaryMin&&job.salaryMin>=preferences.minSalary ) {
		score+=10
	}

	return Math.min( score,100 )
}

// --- Main fetch function ---
export async function fetchAllJobs (): Promise<{ inserted: number; total: number; sources: Record<string, number> }> {
	// Fetch from all sources in parallel
	const [ remoteOKJobs,adzunaJobs,jsearchJobs ]=await Promise.all( [
		fetchRemoteOK(),
		fetchAdzuna(),
		fetchJSearch(),
	] )

	const sources: Record<string, number>={
		remoteok: remoteOKJobs.length,
		adzuna: adzunaJobs.length,
		jsearch: jsearchJobs.length,
	}

	const allJobs=deduplicateJobs( [ ...remoteOKJobs,...adzunaJobs,...jsearchJobs ] )

	let inserted=0
	for ( const job of allJobs ) {
		// Check for existing job by source + sourceId
		const existing=job.sourceId
			? await db.select( { id: externalJobs.id } ).from( externalJobs )
				.where( and( eq( externalJobs.source,job.source ),eq( externalJobs.sourceId,job.sourceId ) ) )
				.limit( 1 )
			: []

		if ( existing.length===0 ) {
			await db.insert( externalJobs ).values( {
				title: job.title,
				company: job.company,
				companyLogo: job.companyLogo||null,
				url: job.url,
				source: job.source,
				sourceId: job.sourceId||null,
				description: job.description||null,
				salaryMin: job.salaryMin||null,
				salaryMax: job.salaryMax||null,
				salaryCurrency: job.salaryCurrency||'USD',
				location: job.location||null,
				isRemote: job.isRemote||false,
				tags: job.tags? JSON.stringify( job.tags ):null,
				postedAt: job.postedAt||null,
			} )
			inserted++
		}
	}

	return { inserted,total: allJobs.length,sources }
}
