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
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const applicationSchema=z.object( {
	companyName: z.string().min( 1,'Company name is required' ),
	position: z.string().min( 1,'Position is required' ),
	jobUrl: z.string().url( 'Please enter a valid URL' ).optional().or( z.literal( '' ) ),
	location: z.string().min( 1,'Location is required' ),
	salary: z.string().optional(),
	notes: z.string().optional(),
	priority: z.enum( [ 'low','medium','high' ] ),
	isRemote: z.boolean(),
} )

type ApplicationFormData=z.infer<typeof applicationSchema>

interface AddApplicationDialogProps {
	open: boolean
	onOpenChange: ( open: boolean ) => void
	onApplicationAdded?: () => Promise<void>
}

export function AddApplicationDialog ( { open,onOpenChange,onApplicationAdded }: AddApplicationDialogProps ) {
	const { toast }=useToast()
	const [ isSubmitting,setIsSubmitting ]=useState( false )

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	}=useForm<ApplicationFormData>( {
		resolver: zodResolver( applicationSchema ),
		defaultValues: {
			priority: 'medium',
			isRemote: false,
		},
	} )

	const isRemote=watch( 'isRemote' )

	const onSubmit=async ( data: ApplicationFormData ) => {
		setIsSubmitting( true )
		try {
			// Send the data to the API
			const response=await fetch( '/api/dashboard/applications/add',{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					...data,
					status: 'applied', // Default status for new applications
				} ),
			} )

			if ( !response.ok ) {
				const errorData=await response.json()
				throw new Error( errorData.error||'Failed to add application' )
			}

			const newApplication=await response.json()
			console.log( 'New application created:',newApplication )

			toast( {
				title: 'Success!',
				description: 'Job application added successfully.',
			} )

			// Call the callback to refresh the applications list and recent activity
			if ( onApplicationAdded ) {
				await onApplicationAdded()
			}

			reset()
			onOpenChange( false )
		} catch ( error ) {
			console.error( 'Error adding application:',error )
			toast( {
				title: 'Error',
				description: error instanceof Error? error.message:'Failed to add job application. Please try again.',
				variant: 'destructive',
			} )
		} finally {
			setIsSubmitting( false )
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] text-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
						Add New Application
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit( onSubmit )} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="companyName" className="text-white">Company Name *</Label>
							<Input
								id="companyName"
								{...register( 'companyName' )}
								placeholder="e.g., Google, Apple"
								className={`${errors.companyName? 'border-red-500':''}`}
							/>
							{errors.companyName&&(
								<p className="text-sm text-red-500">{errors.companyName.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="position" className="text-white">Position *</Label>
							<Input
								id="position"
								{...register( 'position' )}
								placeholder="e.g., Senior Developer"
								className={`${errors.position? 'border-red-500':''}`}
							/>
							{errors.position&&(
								<p className="text-sm text-red-500">{errors.position.message}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="jobUrl" className="text-white">Job URL</Label>
						<Input
							id="jobUrl"
							{...register( 'jobUrl' )}
							placeholder="https://company.com/careers/position"
							type="url"
							className=""
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="location" className="text-white">Location *</Label>
							<Input
								id="location"
								{...register( 'location' )}
								placeholder="e.g., San Francisco, CA"
								className={`${errors.location? 'border-red-500':''}`}
							/>
							{errors.location&&(
								<p className="text-sm text-red-500">{errors.location.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="salary" className="text-white">Salary Range</Label>
							<Input
								id="salary"
								{...register( 'salary' )}
								placeholder="e.g., $100k - $150k"
								className=""
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="priority" className="text-white">Priority</Label>
							<Select onValueChange={( value ) => setValue( 'priority',value as 'low'|'medium'|'high' )}>
								<SelectTrigger className="">
									<SelectValue placeholder="Select priority" />
								</SelectTrigger>
								<SelectContent className="">
									<SelectItem value="low" className="">Low</SelectItem>
									<SelectItem value="medium" className="">Medium</SelectItem>
									<SelectItem value="high" className="">High</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-white">Remote Work</Label>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="isRemote"
									{...register( 'isRemote' )}
									className="w-4 h-4 text-violet-600 bg-white/[0.04] border-white/[0.10] rounded focus:ring-violet-500/40 focus:ring-2"
								/>
								<Label htmlFor="isRemote" className="text-sm text-white">
									Remote position
								</Label>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="notes" className="text-white">Notes</Label>
						<textarea
							id="notes"
							{...register( 'notes' )}
							placeholder="Additional notes, requirements, or thoughts..."
							className="w-full h-24 px-3 py-2 border border-white/[0.10] bg-white/[0.04] backdrop-blur-xl rounded-input focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-transparent resize-none text-white placeholder-violet-300/40"
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange( false )}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
						>
							{isSubmitting? 'Adding...':'Add Application'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
