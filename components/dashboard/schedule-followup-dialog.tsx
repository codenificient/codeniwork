'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Clock, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const followupSchema = z.object({
	contactName: z.string().min(1, 'Contact name is required'),
	contactType: z.string().min(1, 'Contact type is required'),
	reminderDate: z.string().min(1, 'Reminder date is required'),
	reminderTime: z.string().min(1, 'Reminder time is required'),
	notes: z.string().optional(),
	priority: z.string()
})

type FollowupFormData = z.infer<typeof followupSchema>

interface ScheduleFollowupDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ScheduleFollowupDialog({ open, onOpenChange }: ScheduleFollowupDialogProps) {
	const { toast } = useToast()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<FollowupFormData>({
		resolver: zodResolver(followupSchema),
		defaultValues: {
			priority: 'medium'
		}
	})

	const onSubmit = async (data: FollowupFormData) => {
		setIsSubmitting(true)
		try {
			// Here you would typically save to your database
			// For now, we'll simulate a successful save
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			toast({
				title: 'Follow-up Scheduled!',
				description: `Reminder set for ${data.contactName} on ${data.reminderDate}`,
			})
			
			reset()
			onOpenChange(false)
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to schedule follow-up. Please try again.',
				variant: 'destructive'
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleCancel = () => {
		reset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] text-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
						Schedule Follow-up
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="contactName" className="text-white">
								<User className="w-4 h-4 inline mr-2" />
								Contact Name
							</Label>
							<Input
								id="contactName"
								{...register('contactName')}
								className=""
								placeholder="Enter contact name"
							/>
							{errors.contactName && (
								<p className="text-red-400 text-sm mt-1">{errors.contactName.message}</p>
							)}
						</div>

						<div>
							<Label htmlFor="contactType" className="text-white">
								Contact Type
							</Label>
							<Select onValueChange={(value) => register('contactType').onChange({ target: { value } })}>
								<SelectTrigger className="">
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent className="">
									<SelectItem value="recruiter">Recruiter</SelectItem>
									<SelectItem value="hiring_manager">Hiring Manager</SelectItem>
									<SelectItem value="colleague">Colleague</SelectItem>
									<SelectItem value="network">Network Contact</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
							{errors.contactType && (
								<p className="text-red-400 text-sm mt-1">{errors.contactType.message}</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="reminderDate" className="text-white">
								<Calendar className="w-4 h-4 inline mr-2" />
								Reminder Date
							</Label>
							<Input
								id="reminderDate"
								type="date"
								{...register('reminderDate')}
								className=""
							/>
							{errors.reminderDate && (
								<p className="text-red-400 text-sm mt-1">{errors.reminderDate.message}</p>
							)}
						</div>

						<div>
							<Label htmlFor="reminderTime" className="text-white">
								<Clock className="w-4 h-4 inline mr-2" />
								Reminder Time
							</Label>
							<Input
								id="reminderTime"
								type="time"
								{...register('reminderTime')}
								className=""
							/>
							{errors.reminderTime && (
								<p className="text-red-400 text-sm mt-1">{errors.reminderTime.message}</p>
							)}
						</div>
					</div>

					<div>
						<Label htmlFor="priority" className="text-white">
							Priority
						</Label>
						<Select onValueChange={(value) => register('priority').onChange({ target: { value } })} defaultValue="medium">
							<SelectTrigger className="">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="">
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="notes" className="text-white">
							Notes
						</Label>
						<Textarea
							id="notes"
							{...register('notes')}
							className=""
							placeholder="Add any additional notes..."
							rows={3}
						/>
					</div>

					<DialogFooter className="flex space-x-3">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							className=""
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
						>
							{isSubmitting ? 'Scheduling...' : 'Schedule Follow-up'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
