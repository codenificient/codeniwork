import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { Calendar,Download,Edit,Eye,File,FileText,Plus,Trash2 } from 'lucide-react'

// Mock documents data
const documents=[
	{
		id: 1,
		name: 'Software Engineer Resume',
		type: 'Resume',
		format: 'PDF',
		size: '245 KB',
		lastModified: '2024-01-10',
		status: 'Active',
		version: 'v2.1'
	},
	{
		id: 2,
		name: 'Cover Letter - TechCorp',
		type: 'Cover Letter',
		format: 'DOCX',
		size: '89 KB',
		lastModified: '2024-01-08',
		status: 'Active',
		version: 'v1.0'
	},
	{
		id: 3,
		name: 'Portfolio Projects',
		type: 'Portfolio',
		format: 'PDF',
		size: '1.2 MB',
		lastModified: '2024-01-05',
		status: 'Active',
		version: 'v3.0'
	},
	{
		id: 4,
		name: 'Old Resume Backup',
		type: 'Resume',
		format: 'PDF',
		size: '198 KB',
		lastModified: '2023-12-20',
		status: 'Archived',
		version: 'v1.5'
	},
	{
		id: 5,
		name: 'Cover Letter Template',
		type: 'Cover Letter',
		format: 'DOCX',
		size: '67 KB',
		lastModified: '2024-01-02',
		status: 'Template',
		version: 'v1.0'
	}
]

const getTypeIcon=( type: string ) => {
	switch ( type ) {
		case 'Resume':
			return <FileText className="w-5 h-5" />
		case 'Cover Letter':
			return <File className="w-5 h-5" />
		case 'Portfolio':
			return <FileText className="w-5 h-5" />
		default:
			return <File className="w-5 h-5" />
	}
}

const getStatusColor=( status: string ) => {
	switch ( status ) {
		case 'Active':
			return 'bg-green-600/20 text-green-200 border-green-400/30'
		case 'Archived':
			return 'bg-gray-600/20 text-gray-200 border-gray-400/30'
		case 'Template':
			return 'bg-blue-600/20 text-blue-200 border-blue-400/30'
		default:
			return 'bg-gray-600/20 text-gray-200 border-gray-400/30'
	}
}

export default function DocumentsPage () {
	return (
		<div className="min-h-screen">
			<DashboardHeader />
			<div className="p-6">
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
							<p className="text-blue-200">Manage your resumes, cover letters, and portfolios</p>
						</div>
						<Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
							<Plus className="w-4 h-4 mr-2" />
							Upload Document
						</Button>
					</div>
				</div>

				{/* Document Categories */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<FileText className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-white text-lg font-semibold mb-2">Resumes</h3>
							<p className="text-blue-200 text-sm">3 documents</p>
						</CardContent>
					</Card>

					<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<File className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-white text-lg font-semibold mb-2">Cover Letters</h3>
							<p className="text-blue-200 text-sm">2 documents</p>
						</CardContent>
					</Card>

					<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<FileText className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-white text-lg font-semibold mb-2">Portfolios</h3>
							<p className="text-blue-200 text-sm">1 document</p>
						</CardContent>
					</Card>
				</div>

				{/* Documents List */}
				<Card className="bg-white/10 backdrop-blur-sm border-white/20">
					<CardHeader>
						<CardTitle className="text-white">All Documents</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{documents.map( ( doc ) => (
								<div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
									<div className="flex items-center space-x-4">
										<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
											{getTypeIcon( doc.type )}
										</div>
										<div>
											<h3 className="text-white font-medium">{doc.name}</h3>
											<div className="flex items-center space-x-4 mt-1 text-sm text-blue-200">
												<span>{doc.type}</span>
												<span>•</span>
												<span>{doc.format}</span>
												<span>•</span>
												<span>{doc.size}</span>
												<span>•</span>
												<span className="flex items-center space-x-1">
													<Calendar className="w-3 h-3" />
													{doc.lastModified}
												</span>
											</div>
										</div>
									</div>

									<div className="flex items-center space-x-3">
										<Badge className={getStatusColor( doc.status )}>
											{doc.status}
										</Badge>
										<span className="text-xs text-blue-200">{doc.version}</span>

										<div className="flex items-center space-x-2">
											<Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/20">
												<Eye className="w-4 h-4" />
											</Button>
											<Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/20">
												<Download className="w-4 h-4" />
											</Button>
											<Button variant="ghost" size="sm" className="text-blue-200 hover:text-white hover:bg-white/20">
												<Edit className="w-4 h-4" />
											</Button>
											<Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							) )}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
