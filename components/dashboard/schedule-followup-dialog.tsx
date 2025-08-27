'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, Plus } from 'lucide-react'
import { useState } from 'react'

interface ScheduleFollowupDialogProps {
	trigger?: React.ReactNode
}

export function ScheduleFollowupDialog({ trigger }: ScheduleFollowupDialogProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [formData, setFormData] = useState({
		date: '',
		time: '',
		title: '',
		description: '',
		applicationId: '',
		reminderType: 'email'
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		try {
			// Here you would typically save to your database
			// For now, we'll just log and close the dialog
			console.log('Scheduling follow-up:', formData)
			
			// TODO: Implement API call to save follow-up
			// const response = await fetch('/api/followups', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(formData)
			// })
			
			// Reset form and close dialog
			setFormData({
				date: '',
				time: '',
				title: '',
				description: '',
				applicationId: '',
				reminderType: 'email'
			})
			setIsOpen(false)
			
			// Show success message (you can use your toast system)
			alert('Follow-up scheduled successfully!')
		} catch (error) {
			console.error('Error scheduling follow-up:', error)
			alert('Failed to schedule follow-up. Please try again.')
		}
	}

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
						<Plus className="w-4 h-4 mr-2" />
						Schedule Follow-up
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border border-white/20">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold text-gray-900">
						Schedule Follow-up
					</DialogTitle>
				</DialogHeader>
				
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="date" className="text-sm font-medium text-gray-700">
								Date
							</Label>
							<div className="relative">
								<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
								<Input
									id="date"
									type="date"
									value={formData.date}
									onChange={(e) => handleInputChange('date', e.target.value)}
									className="pl-10 bg-white/80 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
									required
								/>
							</div>
						</div>
						
						<div>
							<Label htmlFor="time" className="text-sm font-medium text-gray-700">
								Time
							</Label>
							<div className="relative">
								<Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
								<Input
									id="time"
									type="time"
									value={formData.time}
									onChange={(e) => handleInputChange('time', e.target.value)}
									className="pl-10 bg-white/80 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
									required
								/>
							</div>
						</div>
					</div>
					
					<div>
						<Label htmlFor="title" className="text-sm font-medium text-gray-700">
							Title
						</Label>
						<Input
							id="title"
							placeholder="e.g., Follow up on application"
							value={formData.title}
							onChange={(e) => handleInputChange('title', e.target.value)}
							className="bg-white/80 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
							required
						/>
					</div>
					
					<div>
						<Label htmlFor="description" className="text-sm font-medium text-gray-700">
							Description
						</Label>
						<Textarea
							id="description"
							placeholder="Add notes about this follow-up..."
							value={formData.description}
							onChange={(e) => handleInputChange('description', e.target.value)}
							className="bg-white/80 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
							rows={3}
						/>
					</div>
					
					<div className="flex justify-end space-x-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
							className="border-gray-300 text-gray-700 hover:bg-gray-50"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
						>
							Schedule Follow-up
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
