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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const documentSchema = z.object({
	name: z.string().min(1, 'Document name is required').max(100, 'Document name too long'),
	type: z.string().min(1, 'Document type is required'),
	description: z.string().optional(),
	status: z.string().min(1, 'Status is required'),
	version: z.string().min(1, 'Version is required'),
})

type DocumentFormData = z.infer<typeof documentSchema>

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

interface EditDocumentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	document: Document | null
	onDocumentUpdated: () => Promise<void>
}

export function EditDocumentDialog({ 
	open, 
	onOpenChange, 
	document, 
	onDocumentUpdated 
}: EditDocumentDialogProps) {
	const { toast } = useToast()

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
			type: 'resume',
			description: '',
			status: 'active',
			version: 'v1.0',
		},
	})

	const documentType = watch('type')

	// Pre-populate form when document changes
	useEffect(() => {
		if (document && open) {
			setValue('name', document.name)
			setValue('type', document.type)
			setValue('description', document.description || '')
			setValue('status', document.status)
			setValue('version', document.version)
		}
	}, [document, open, setValue])

	const onSubmit = async (data: DocumentFormData) => {
		if (!document) return

		try {
			// Update document via API
			const response = await fetch(`/api/dashboard/documents/${document.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to update document')
			}

			const updatedDocument = await response.json()
			console.log('Updated document:', updatedDocument)

			toast({
				title: 'Success!',
				description: 'Document updated successfully.',
			})

			// Call the callback to refresh the documents list
			await onDocumentUpdated()
			
			// Close the dialog after successful update
			onOpenChange(false)
		} catch (error) {
			console.error('Error updating document:', error)
			toast({
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to update document. Please try again.',
				variant: 'destructive',
			})
		}
	}

	const handleClose = () => {
		reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] bg-gray-900/95 backdrop-blur-sm border border-gray-700 text-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
						Edit Document
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
							<Label htmlFor="status" className="text-white">Status *</Label>
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
							<Label htmlFor="version" className="text-white">Version *</Label>
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

					{/* Read-only fields */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="bg-white/5 p-3 rounded-lg">
							<p className="text-gray-400">Format</p>
							<p className="text-white font-medium">{document?.format}</p>
						</div>
						<div className="bg-white/5 p-3 rounded-lg">
							<p className="text-gray-400">Size</p>
							<p className="text-white font-medium">{document?.size}</p>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
						>
							Update Document
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
