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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const applicationSchema = z.object({
	companyName: z.string().min(1, 'Company name is required'),
	position: z.string().min(1, 'Position is required'),
	jobUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
	location: z.string().min(1, 'Location is required'),
	salary: z.string().optional(),
	notes: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']),
	isRemote: z.boolean().default(false),
	status: z.enum(['applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn']),
	deadline: z.string().optional(),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

interface JobApplication {
	id: string
	position: string
	status: string
	priority: string | null
	salary: string | null
	location: string | null
	jobUrl: string | null
	notes: string | null
	appliedAt: Date | string
	deadline: Date | string | null
	isRemote: boolean | null
	company: {
		id: string
		name: string
		logo: string | null
		website: string | null
	}
}

interface EditApplicationDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	application: JobApplication | null
	onApplicationUpdated: () => void
}

export function EditApplicationDialog({ 
	open, 
	onOpenChange, 
	application, 
	onApplicationUpdated 
}: EditApplicationDialogProps) {
	const { toast } = useToast()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<ApplicationFormData>({
		resolver: zodResolver(applicationSchema),
		defaultValues: {
			priority: 'medium',
			isRemote: false,
			status: 'applied',
		},
	})

	const isRemote = watch('isRemote')

	// Pre-populate form when application changes
	useEffect(() => {
		if (application && open) {
			setValue('companyName', application.company.name)
			setValue('position', application.position)
			setValue('jobUrl', application.jobUrl || '')
			setValue('location', application.location || '')
			setValue('salary', application.salary || '')
			setValue('notes', application.notes || '')
			setValue('priority', (application.priority as 'low' | 'medium' | 'high') || 'medium')
			setValue('isRemote', application.isRemote || false)
			setValue('status', application.status as any)
			
			// Handle deadline date
			if (application.deadline) {
				const deadlineDate = typeof application.deadline === 'string' 
					? new Date(application.deadline) 
					: application.deadline
				if (!isNaN(deadlineDate.getTime())) {
					setValue('deadline', deadlineDate.toISOString().split('T')[0])
				}
			}
		}
	}, [application, open, setValue])

	const onSubmit = async (data: ApplicationFormData) => {
		if (!application) return

		setIsSubmitting(true)
		try {
			// Here you would typically send the data to your API
			console.log('Updated application data:', data)
			console.log('Application ID:', application.id)

			toast({
				title: 'Success!',
				description: 'Job application updated successfully.',
			})

			onApplicationUpdated()
			onOpenChange(false)
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update job application. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleClose = () => {
		reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border border-white/20">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						Edit Application
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="companyName">Company Name *</Label>
							<Input
								id="companyName"
								{...register('companyName')}
								placeholder="e.g., Google, Apple"
								className={errors.companyName ? 'border-red-500' : ''}
							/>
							{errors.companyName && (
								<p className="text-sm text-red-500">{errors.companyName.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="position">Position *</Label>
							<Input
								id="position"
								{...register('position')}
								placeholder="e.g., Senior Developer"
								className={errors.position ? 'border-red-500' : ''}
							/>
							{errors.position && (
								<p className="text-sm text-red-500">{errors.position.message}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="jobUrl">Job URL</Label>
						<Input
							id="jobUrl"
							{...register('jobUrl')}
							placeholder="https://company.com/careers/position"
							type="url"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="location">Location *</Label>
							<Input
								id="location"
								{...register('location')}
								placeholder="e.g., San Francisco, CA"
								className={errors.location ? 'border-red-500' : ''}
							/>
							{errors.location && (
								<p className="text-sm text-red-500">{errors.location.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="salary">Salary Range</Label>
							<Input
								id="salary"
								{...register('salary')}
								placeholder="e.g., $100k - $150k"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select onValueChange={(value) => setValue('status', value as any)}>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="applied">Applied</SelectItem>
									<SelectItem value="screening">Screening</SelectItem>
									<SelectItem value="interview">Interview</SelectItem>
									<SelectItem value="offer">Offer</SelectItem>
									<SelectItem value="rejected">Rejected</SelectItem>
									<SelectItem value="withdrawn">Withdrawn</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="priority">Priority</Label>
							<Select onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}>
								<SelectTrigger>
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="deadline">Deadline</Label>
							<Input
								id="deadline"
								type="date"
								{...register('deadline')}
							/>
						</div>

						<div className="space-y-2">
							<Label>Remote Work</Label>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="isRemote"
									{...register('isRemote')}
									className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
								/>
								<Label htmlFor="isRemote" className="text-sm">
									Remote position
								</Label>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<textarea
							id="notes"
							{...register('notes')}
							placeholder="Additional notes, requirements, or thoughts..."
							className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
							disabled={isSubmitting}
							className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
						>
							{isSubmitting ? 'Updating...' : 'Update Application'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
