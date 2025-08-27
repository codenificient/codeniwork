'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, Download, FileText, File, ExternalLink, X } from 'lucide-react'
import { useState, useEffect } from 'react'

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

interface DocumentViewerModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	document: Document | null
}

export function DocumentViewerModal({ 
	open, 
	onOpenChange, 
	document: doc 
}: DocumentViewerModalProps) {
	const [isLoading, setIsLoading] = useState(true)

	// Reset loading state when document changes
	useEffect(() => {
		if (doc) {
			setIsLoading(true)
			// Set a timeout to hide loading after 1.5 seconds to prevent infinite loading
			const timeout = setTimeout(() => {
				setIsLoading(false)
			}, 1500)
			
			return () => clearTimeout(timeout)
		}
	}, [doc])

	if (!doc) return null

	const isPDF = doc.format.toLowerCase() === 'pdf' || doc.fileUrl.toLowerCase().includes('.pdf')
	const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(doc.format.toLowerCase()) || 
		['.jpg', '.jpeg', '.png', '.gif'].some(ext => doc.fileUrl.toLowerCase().includes(ext))
	const isViewable = isPDF || isImage

	const handleDownload = async () => {
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
		}
	}

	const handleOpenInNewTab = () => {
		window.open(doc.fileUrl, '_blank')
	}

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'resume':
				return <FileText className="w-5 h-5" />
			case 'cover_letter':
				return <FileText className="w-5 h-5" />
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-gray-900/95 backdrop-blur-sm border border-gray-700 text-white overflow-hidden">
				<DialogHeader className="pb-4">
					<div className="flex items-start justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
								{getTypeIcon(doc.type)}
							</div>
							<div>
								<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
									{doc.name}
								</DialogTitle>
								<div className="flex items-center space-x-2 mt-1">
									<Badge className={getStatusColor(doc.status)}>
										{doc.status}
									</Badge>
									<span className="text-sm text-gray-400">{doc.version}</span>
								</div>
							</div>
						</div>
						
						<div className="flex items-center space-x-4">
							<Button
								variant="outline"
								size="sm"
								onClick={handleOpenInNewTab}
								className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
							>
								<ExternalLink className="w-4 h-4 mr-2" />
								Open
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleDownload}
								className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
							>
								<Download className="w-4 h-4 mr-2" />
								Download
							</Button>

						</div>
					</div>
				</DialogHeader>

				<div className="flex-1 overflow-hidden">
					{/* Document Info */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
						<div className="bg-white/5 p-3 rounded-lg">
							<p className="text-gray-400">Type</p>
							<p className="text-white font-medium capitalize">{doc.type.replace('_', ' ')}</p>
						</div>
						<div className="bg-white/5 p-3 rounded-lg">
							<p className="text-gray-400">Format</p>
							<p className="text-white font-medium">{doc.format}</p>
						</div>
						<div className="bg-white/5 p-3 rounded-lg">
							<p className="text-gray-400">Size</p>
							<p className="text-white font-medium">{doc.size}</p>
						</div>
						<div className="bg-white/5 p-3 rounded-lg">
							<p className="text-gray-400">Updated</p>
							<p className="text-white font-medium">{formatDate(doc.updatedAt)}</p>
						</div>
					</div>

					{/* Document Description */}
					{doc.description && (
						<div className="mb-6">
							<h3 className="text-white font-semibold mb-2">Description</h3>
							<p className="text-gray-300 bg-white/5 p-3 rounded-lg">
								{doc.description}
							</p>
						</div>
					)}

					{/* Document Viewer */}
					<div className="bg-white/5 rounded-lg overflow-hidden">
						{isViewable ? (
							<div className="h-96 relative">
								{isPDF ? (
									<>
										<iframe
											src={doc.fileUrl}
											className="w-full h-full border-0"
											onLoad={() => setIsLoading(false)}
											onError={() => setIsLoading(false)}
											title={`PDF Viewer - ${doc.name}`}
											sandbox="allow-same-origin allow-scripts allow-forms"
										/>
										{/* PDF Fallback - if iframe doesn't load properly */}
										<div className="absolute top-2 right-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => window.open(doc.fileUrl, '_blank')}
												className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700/80"
											>
												<ExternalLink className="w-4 h-4 mr-2" />
												Open PDF
											</Button>
										</div>
									</>
								) : isImage ? (
									<img
										src={doc.fileUrl}
										alt={doc.name}
										className="w-full h-full object-contain"
										onLoad={() => setIsLoading(false)}
										onError={() => setIsLoading(false)}
									/>
								) : null}
								
								{isLoading && (
									<div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
										<div className="text-center">
											<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
											<p className="text-gray-300 mb-2">Loading document...</p>
											<p className="text-sm text-gray-400">This may take a few moments</p>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="h-96 flex items-center justify-center">
								<div className="text-center">
									<File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-300 mb-2">Preview not available</p>
									<p className="text-sm text-gray-400">This document type cannot be previewed</p>
									<Button
										onClick={handleDownload}
										className="mt-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
									>
										<Download className="w-4 h-4 mr-2" />
										Download to View
									</Button>
								</div>
							</div>
						)}
					</div>

					{/* Document Actions */}
					<div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
						<div className="flex items-center space-x-4 text-sm text-gray-400">
							<span className="flex items-center space-x-1">
								<Calendar className="w-4 h-4" />
								<span>Created: {formatDate(doc.createdAt)}</span>
							</span>
							<span className="flex items-center space-x-1">
								<Calendar className="w-4 h-4" />
								<span>Updated: {formatDate(doc.updatedAt)}</span>
							</span>
						</div>
						
						<div className="flex items-center space-x-4">
							<Button
								variant="outline"
								onClick={handleOpenInNewTab}
								className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
							>
								<ExternalLink className="w-4 h-4 mr-2" />
								Open in New Tab
							</Button>
							<Button
								onClick={handleDownload}
								className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
							>
								<Download className="w-4 h-4 mr-2" />
								Download Document
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
