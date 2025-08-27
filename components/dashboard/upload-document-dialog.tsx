'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, File, Upload, X } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const documentSchema = z.object({
	name: z.string().min(1, 'Document name is required'),
	type: z.string().min(1, 'Document type is required'),
	description: z.string().optional(),
	status: z.string().default('active'),
	version: z.string().default('v1.0'),
})

type DocumentFormData = z.infer<typeof documentSchema>

interface UploadDocumentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onDocumentUploaded: () => Promise<void>
	presetDocumentType?: string
}

export function UploadDocumentDialog({ 
	open, 
	onOpenChange, 
	onDocumentUploaded,
	presetDocumentType
}: UploadDocumentDialogProps) {
	const { toast } = useToast()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [uploadProgress, setUploadProgress] = useState(0)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<DocumentFormData>({
		resolver: zodResolver(documentSchema),
		defaultValues: {
			name: '',
			type: presetDocumentType || 'resume',
			description: '',
			status: 'active',
			version: 'v1.0',
		},
	})

	const documentType = watch('type')

	// Update form when presetDocumentType changes
	useEffect(() => {
		if (presetDocumentType) {
			setValue('type', presetDocumentType)
		}
	}, [presetDocumentType, setValue])

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			// Validate file type
			const allowedTypes = [
				'application/pdf',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'application/vnd.ms-excel',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'text/plain',
				'image/jpeg',
				'image/png',
				'image/gif'
			]

			if (!allowedTypes.includes(file.type)) {
				toast({
					title: 'Invalid file type',
					description: 'Please select a valid document file (PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF)',
					variant: 'destructive',
				})
				return
			}

			// Validate file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				toast({
					title: 'File too large',
					description: 'Please select a file smaller than 10MB',
					variant: 'destructive',
				})
				return
			}

			setSelectedFile(file)
			
			// Auto-fill name if not provided
			if (!watch('name')) {
				setValue('name', file.name.replace(/\.[^/.]+$/, '')) // Remove file extension
			}
		}
	}

	const removeFile = () => {
		setSelectedFile(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const getFileIcon = (fileType: string) => {
		if (fileType.startsWith('image/')) return <FileText className="w-5 h-5" />
		if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />
		if (fileType.includes('word') || fileType.includes('document')) return <FileText className="w-5 h-5" />
		if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <File className="w-5 h-5" />
		return <File className="w-5 h-5" />
	}

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const onSubmit = async (data: DocumentFormData) => {
		if (!selectedFile) {
			toast({
				title: 'No file selected',
				description: 'Please select a file to upload',
				variant: 'destructive',
			})
			return
		}

		setIsSubmitting(true)
		setUploadProgress(0)

		try {
			// Simulate upload progress
			const progressInterval = setInterval(() => {
				setUploadProgress(prev => Math.min(prev + 10, 90))
			}, 100)

			// Create FormData for file upload
			const formData = new FormData()
			formData.append('file', selectedFile)
			formData.append('documentType', data.type)

			// Upload to Cloudinary via our API endpoint
			const response = await fetch('/api/upload/document', {
				method: 'POST',
				body: formData,
			})

			clearInterval(progressInterval)
			setUploadProgress(100)

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to upload document')
			}

			const uploadResult = await response.json()

			// Create document record in database
			const documentData = {
				name: data.name,
				type: data.type,
				format: uploadResult.format?.toUpperCase() || selectedFile.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
				size: formatFileSize(uploadResult.bytes || selectedFile.size),
				fileUrl: uploadResult.secure_url,
				publicId: uploadResult.public_id,
				description: data.description,
				status: data.status,
				version: data.version,
			}

			const createResponse = await fetch('/api/dashboard/documents', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(documentData),
			})

			if (!createResponse.ok) {
				const errorData = await createResponse.json()
				throw new Error(errorData.error || 'Failed to create document record')
			}

			toast({
				title: 'Success!',
				description: 'Document uploaded successfully.',
			})

			// Call the callback to refresh the documents list
			await onDocumentUploaded()
			
			// Close the dialog after successful upload
			onOpenChange(false)
		} catch (error) {
			console.error('Error uploading document:', error)
			toast({
				title: 'Upload failed',
				description: error instanceof Error ? error.message : 'Failed to upload document. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
			setUploadProgress(0)
		}
	}

	const handleClose = () => {
		reset()
		setSelectedFile(null)
		setUploadProgress(0)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] bg-gray-900/95 backdrop-blur-sm border border-gray-700 text-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
						Upload Document
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* File Upload Section */}
					<div className="space-y-4">
						<Label className="text-white">Select Document</Label>
						<div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
								onChange={handleFileSelect}
								className="hidden"
							/>
							
							{!selectedFile ? (
								<div>
									<Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<p className="text-gray-300 mb-2">Click to select a document</p>
									<p className="text-sm text-gray-400">PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF up to 10MB</p>
									<Button
										type="button"
										variant="outline"
										onClick={() => fileInputRef.current?.click()}
										className="mt-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
									>
										Choose File
									</Button>
								</div>
							) : (
								<div className="text-left">
									<div className="flex items-center space-x-3 mb-3">
										{getFileIcon(selectedFile.type)}
										<div className="flex-1">
											<p className="text-white font-medium">{selectedFile.name}</p>
											<p className="text-sm text-gray-400">{formatFileSize(selectedFile.size)}</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={removeFile}
											className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
										>
											<X className="w-4 h-4" />
										</Button>
									</div>
									
									{uploadProgress > 0 && (
										<div className="w-full bg-gray-700 rounded-full h-2">
											<div 
												className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
												style={{ width: `${uploadProgress}%` }}
											></div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Document Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-white">Document Name *</Label>
							<Input
								id="name"
								{...register('name')}
								placeholder="e.g., Software Engineer Resume"
								className={`bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${errors.name ? 'border-red-500' : ''}`}
							/>
							{errors.name && (
								<p className="text-sm text-red-500">{errors.name.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="type" className="text-white">Document Type *</Label>
							<Select onValueChange={(value) => setValue('type', value)} defaultValue={documentType}>
								<SelectTrigger className="bg-gray-800 border-gray-600 text-white">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-600 text-white">
									<SelectItem value="resume">Resume</SelectItem>
									<SelectItem value="cover_letter">Cover Letter</SelectItem>
									<SelectItem value="portfolio">Portfolio</SelectItem>
									<SelectItem value="certificate">Certificate</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="status" className="text-white">Status</Label>
							<Select onValueChange={(value) => setValue('status', value)} defaultValue="active">
								<SelectTrigger className="bg-gray-800 border-gray-600 text-white">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent className="bg-gray-800 border-gray-600 text-white">
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="archived">Archived</SelectItem>
									<SelectItem value="template">Template</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="version" className="text-white">Version</Label>
							<Input
								id="version"
								{...register('version')}
								placeholder="e.g., v1.0"
								className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description" className="text-white">Description</Label>
						<textarea
							id="description"
							{...register('description')}
							placeholder="Document description or notes..."
							className="w-full h-24 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-800 text-white placeholder-gray-400"
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting || !selectedFile}
							className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
						>
							{isSubmitting ? 'Uploading...' : 'Upload Document'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
