'use client'

import { DashboardHeader } from '@/components/dashboard/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DocumentViewerModal } from '@/components/dashboard/document-viewer-modal'
import { EditDocumentDialog } from '@/components/dashboard/edit-document-dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { UploadDocumentDialog } from '@/components/dashboard/upload-document-dialog'
import { Calendar, Download, Edit, Eye, File, FileText, Plus, Trash2, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface Document {
	id: string
	name: string
	type: string
	format: string
	size: string
	fileUrl: string
	description?: string
	status: string
	version: string
	createdAt: string
	updatedAt: string
}

export default function DocumentsPage() {
	const { toast } = useToast()
	const [documents, setDocuments] = useState<Document[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
	const [viewingDocument, setViewingDocument] = useState<Document | null>(null)
	const [editingDocument, setEditingDocument] = useState<Document | null>(null)
	const [isViewerOpen, setIsViewerOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

	useEffect(() => {
		fetchDocuments()
	}, [])

	const fetchDocuments = async () => {
		try {
			const response = await fetch('/api/dashboard/documents')
			if (!response.ok) {
				throw new Error('Failed to fetch documents')
			}
			const data = await response.json()
			setDocuments(data)
		} catch (error) {
			console.error('Error fetching documents:', error)
			toast({
				title: 'Error',
				description: 'Failed to fetch documents. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleDocumentUploaded = async () => {
		await fetchDocuments()
	}

	const handleDocumentUpdated = async () => {
		await fetchDocuments()
	}

	const handleViewDocument = (document: Document) => {
		setViewingDocument(document)
		setIsViewerOpen(true)
	}

	const handleEditDocument = (document: Document) => {
		setEditingDocument(document)
		setIsEditDialogOpen(true)
	}

	const handleDeleteDocument = async (document: Document) => {
		if (!confirm(`Are you sure you want to delete "${document.name}"?`)) {
			return
		}

		try {
			const response = await fetch(`/api/dashboard/documents/${document.id}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error('Failed to delete document')
			}

			toast({
				title: 'Success!',
				description: 'Document deleted successfully.',
			})

			await fetchDocuments()
		} catch (error) {
			console.error('Error deleting document:', error)
			toast({
				title: 'Error',
				description: 'Failed to delete document. Please try again.',
				variant: 'destructive',
			})
		}
	}

	const handleDownload = async (doc: Document) => {
		try {
			const response = await fetch(doc.fileUrl)
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = doc.name
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			document.body.removeChild(a)
		} catch (error) {
			console.error('Error downloading document:', error)
			toast({
				title: 'Download failed',
				description: 'Failed to download document. Please try again.',
				variant: 'destructive',
			})
		}
	}

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'resume':
				return <FileText className="w-5 h-5" />
			case 'cover_letter':
				return <File className="w-5 h-5" />
			case 'portfolio':
				return <FileText className="w-5 h-5" />
			case 'certificate':
				return <FileText className="w-5 h-5" />
			default:
				return <File className="w-5 h-5" />
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-600/20 text-green-200 border-green-400/30'
			case 'archived':
				return 'bg-gray-600/20 text-gray-200 border-gray-400/30'
			case 'template':
				return 'bg-blue-600/20 text-blue-200 border-blue-400/30'
			default:
				return 'bg-gray-600/20 text-gray-200 border-gray-400/30'
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	}

	// Calculate document counts by type
	const getDocumentCounts = () => {
		const counts = documents.reduce((acc, doc) => {
			acc[doc.type] = (acc[doc.type] || 0) + 1
			return acc
		}, {} as Record<string, number>)

		return {
			resume: counts.resume || 0,
			cover_letter: counts.cover_letter || 0,
			portfolio: counts.portfolio || 0,
			certificate: counts.certificate || 0,
			other: counts.other || 0,
		}
	}

	const documentCounts = getDocumentCounts()

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<DashboardHeader />
				<div className="p-6">
					<div className="flex items-center justify-center h-64">
						<LoadingSpinner />
					</div>
				</div>
			</div>
		)
	}

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
						<div className="flex items-center space-x-3">
							<Button
								onClick={fetchDocuments}
								variant="outline"
								className="bg-white/10 border-white/20 text-white hover:bg-white/20"
							>
								<RefreshCw className="w-4 h-4 mr-2" />
								Refresh
							</Button>
							<Button 
								onClick={() => setIsUploadDialogOpen(true)}
								className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
							>
								<Plus className="w-4 h-4 mr-2" />
								Upload Document
							</Button>
						</div>
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
							<p className="text-blue-200 text-sm">{documentCounts.resume} document{documentCounts.resume !== 1 ? 's' : ''}</p>
						</CardContent>
					</Card>

					<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<File className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-white text-lg font-semibold mb-2">Cover Letters</h3>
							<p className="text-blue-200 text-sm">{documentCounts.cover_letter} document{documentCounts.cover_letter !== 1 ? 's' : ''}</p>
						</CardContent>
					</Card>

					<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-200">
						<CardContent className="p-6 text-center">
							<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<FileText className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-white text-lg font-semibold mb-2">Portfolios</h3>
							<p className="text-blue-200 text-sm">{documentCounts.portfolio} document{documentCounts.portfolio !== 1 ? 's' : ''}</p>
						</CardContent>
					</Card>
				</div>

				{/* Documents List */}
				<Card className="bg-white/10 backdrop-blur-sm border-white/20">
					<CardHeader>
						<CardTitle className="text-white">All Documents</CardTitle>
					</CardHeader>
					<CardContent>
						{documents.length === 0 ? (
							<div className="text-center py-12">
								<FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
								<p className="text-gray-300 mb-4">Upload your first document to get started.</p>
								<Button
									onClick={() => setIsUploadDialogOpen(true)}
									className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
								>
									<Plus className="w-4 h-4 mr-2" />
									Upload Document
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{documents.map((doc) => (
									<div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200">
										<div className="flex items-center space-x-4">
											<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
												{getTypeIcon(doc.type)}
											</div>
											<div>
												<h3 className="text-white font-medium">{doc.name}</h3>
												<div className="flex items-center space-x-4 mt-1 text-sm text-blue-200">
													<span className="capitalize">{doc.type.replace('_', ' ')}</span>
													<span>•</span>
													<span>{doc.format}</span>
													<span>•</span>
													<span>{doc.size}</span>
													<span>•</span>
													<span className="flex items-center space-x-1">
														<Calendar className="w-3 h-3" />
														{formatDate(doc.updatedAt)}
													</span>
												</div>
												{doc.description && (
													<p className="text-sm text-gray-300 mt-1">{doc.description}</p>
												)}
											</div>
										</div>

										<div className="flex items-center space-x-3">
											<Badge className={getStatusColor(doc.status)}>
												{doc.status}
											</Badge>
											<span className="text-xs text-blue-200">{doc.version}</span>

											<div className="flex items-center space-x-2">
												<Button 
													variant="ghost" 
													size="sm" 
													onClick={() => handleViewDocument(doc)}
													className="text-blue-200 hover:text-white hover:bg-white/20"
													title="View Document"
												>
													<Eye className="w-4 h-4" />
												</Button>
												<Button 
													variant="ghost" 
													size="sm" 
													onClick={() => handleDownload(doc)}
													className="text-blue-200 hover:text-white hover:bg-white/20"
													title="Download Document"
												>
													<Download className="w-4 h-4" />
												</Button>
												<Button 
													variant="ghost" 
													size="sm" 
													onClick={() => handleEditDocument(doc)}
													className="text-blue-200 hover:text-white hover:bg-white/20"
													title="Edit Document"
												>
													<Edit className="w-4 h-4" />
												</Button>
												<Button 
													variant="ghost" 
													size="sm" 
													onClick={() => handleDeleteDocument(doc)}
													className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
													title="Delete Document"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Upload Document Dialog */}
				<UploadDocumentDialog
					open={isUploadDialogOpen}
					onOpenChange={setIsUploadDialogOpen}
					onDocumentUploaded={handleDocumentUploaded}
				/>

				{/* Document Viewer Modal */}
				<DocumentViewerModal
					open={isViewerOpen}
					onOpenChange={setIsViewerOpen}
					document={viewingDocument}
				/>

				{/* Edit Document Dialog */}
				<EditDocumentDialog
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					document={editingDocument}
					onDocumentUpdated={handleDocumentUpdated}
				/>
			</div>
		</div>
	)
}
