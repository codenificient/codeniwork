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
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2,Camera,Image as ImageIcon } from 'lucide-react'
import { useEffect,useRef,useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

const companySchema=z.object( {
	name: z.string().min( 1,'Company name is required' ),
	website: z.string().url( 'Please enter a valid URL' ).optional().or( z.literal( '' ) ),
	description: z.string().optional(),
	location: z.string().optional(),
	industry: z.string().optional(),
	size: z.string().optional(),
} )

type CompanyFormData=z.infer<typeof companySchema>

interface Company {
	id: string
	name: string
	website: string|null
	logo: string|null
	description: string|null
	location: string|null
	industry: string|null
	size: string|null
}

interface EditCompanyDialogProps {
	open: boolean
	onOpenChange: ( open: boolean ) => void
	company: Company|null
	onCompanyUpdated: () => Promise<void>
}

export function EditCompanyDialog ( {
	open,
	onOpenChange,
	company,
	onCompanyUpdated
}: EditCompanyDialogProps ) {
	const { toast }=useToast()
	const fileInputRef=useRef<HTMLInputElement>( null )

	const [ isSubmitting,setIsSubmitting ]=useState( false )
	const [ companyLogo,setCompanyLogo ]=useState<File|null>( null )
	const [ previewUrl,setPreviewUrl ]=useState<string|null>( company?.logo||null )

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	}=useForm<CompanyFormData>( {
		resolver: zodResolver( companySchema ),
		defaultValues: {
			name: '',
			website: '',
			description: '',
			location: '',
			industry: '',
			size: '',
		},
	} )

	// Pre-populate form when company changes
	useEffect( () => {
		if ( company&&open ) {
			setValue( 'name',company.name )
			setValue( 'website',company.website||'' )
			setValue( 'description',company.description||'' )
			setValue( 'location',company.location||'' )
			setValue( 'industry',company.industry||'' )
			setValue( 'size',company.size||'' )
			setPreviewUrl( company.logo )
		}
	},[ company,open,setValue ] )

	const handleLogoSelect=( event: React.ChangeEvent<HTMLInputElement> ) => {
		const file=event.target.files?.[ 0 ]
		if ( file ) {
			// Validate file type
			if ( !file.type.startsWith( 'image/' ) ) {
				toast( {
					title: 'Invalid file type',
					description: 'Please select an image file (JPEG, PNG, etc.)',
					variant: 'destructive',
				} )
				return
			}

			// Validate file size (max 5MB)
			if ( file.size>5*1024*1024 ) {
				toast( {
					title: 'File too large',
					description: 'Please select an image smaller than 5MB',
					variant: 'destructive',
				} )
				return
			}

			setCompanyLogo( file )

			// Create preview URL
			const url=URL.createObjectURL( file )
			setPreviewUrl( url )
		}
	}

	const handleLogoUpload=async (): Promise<string|null> => {
		if ( !companyLogo||!company ) return null

		try {
			// Create FormData for file upload
			const formData=new FormData()
			formData.append( 'file',companyLogo )
			formData.append( 'companyId',company.id )

			// Upload to Cloudinary via our API endpoint
			const response=await fetch( '/api/upload/company-logo',{
				method: 'POST',
				body: formData,
			} )

			if ( !response.ok ) {
				const errorData=await response.json()
				throw new Error( errorData.error||'Failed to upload logo' )
			}

			const data=await response.json()
			return data.secure_url
		} catch ( error ) {
			console.error( 'Error uploading company logo:',error )
			toast( {
				title: 'Logo upload failed',
				description: error instanceof Error? error.message:'Failed to upload company logo. Please try again.',
				variant: 'destructive',
			} )
			return null
		}
	}

	const onSubmit=async ( data: CompanyFormData ) => {
		if ( !company ) return

		setIsSubmitting( true )
		try {
			// Upload logo first if selected
			let logoUrl=null
			if ( companyLogo ) {
				logoUrl=await handleLogoUpload()
				if ( !logoUrl ) {
					setIsSubmitting( false )
					return
				}
			}

			// Prepare update data
			const updateData: any={
				name: data.name,
				website: data.website||null,
				description: data.description||null,
				location: data.location||null,
				industry: data.industry||null,
				size: data.size||null,
			}

			if ( logoUrl ) {
				updateData.logo=logoUrl
			}

			// Update company via API
			const response=await fetch( `/api/dashboard/companies/${company.id}`,{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( updateData ),
			} )

			if ( !response.ok ) {
				const errorData=await response.json()
				throw new Error( errorData.error||'Failed to update company' )
			}

			const updatedCompany=await response.json()
			console.log( 'Updated company:',updatedCompany )

			toast( {
				title: 'Success!',
				description: 'Company updated successfully.',
			} )

			// Call the callback to refresh the companies list
			await onCompanyUpdated()

			// Close the dialog after successful update
			onOpenChange( false )
		} catch ( error ) {
			console.error( 'Error updating company:',error )
			toast( {
				title: 'Error',
				description: error instanceof Error? error.message:'Failed to update company. Please try again.',
				variant: 'destructive',
			} )
		} finally {
			setIsSubmitting( false )
		}
	}

	const handleClose=() => {
		reset()
		setCompanyLogo( null )
		setPreviewUrl( company?.logo||null )
		if ( fileInputRef.current ) {
			fileInputRef.current.value=''
		}
		onOpenChange( false )
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] text-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
						Edit Company
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit( onSubmit )} className="space-y-6">
					{/* Company Logo Section */}
					<div className="space-y-4">
						<Label className="text-white">Company Logo</Label>
						<div className="flex items-center space-x-4">
							<div className="relative">
								<div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
									{previewUrl? (
										<img
											src={previewUrl}
											alt="Company Logo"
											className="w-full h-full object-cover"
										/>
									):(
										<Building2 className="w-10 h-10 text-white" />
									)}
								</div>
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
									onClick={() => fileInputRef.current?.click()}
								>
									<Camera className="w-4 h-4" />
								</Button>
							</div>
							<div className="flex-1">
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleLogoSelect}
									className="hidden"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={() => fileInputRef.current?.click()}
									className=""
								>
									<ImageIcon className="w-4 h-4 mr-2" />
									Choose Logo
								</Button>
								<p className="text-sm text-violet-300/40 mt-1">
									JPEG, PNG up to 5MB
								</p>
							</div>
						</div>
					</div>

					{/* Company Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-white">Company Name *</Label>
							<Input
								id="name"
								{...register( 'name' )}
								placeholder="e.g., Google, Apple"
								className={`${errors.name? 'border-red-500':''}`}
							/>
							{errors.name&&(
								<p className="text-sm text-red-500">{errors.name.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="website" className="text-white">Website</Label>
							<Input
								id="website"
								{...register( 'website' )}
								placeholder="https://company.com"
								type="url"
								className=""
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="industry" className="text-white">Industry</Label>
							<Input
								id="industry"
								{...register( 'industry' )}
								placeholder="e.g., Technology, Healthcare"
								className=""
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="size" className="text-white">Company Size</Label>
							<Input
								id="size"
								{...register( 'size' )}
								placeholder="e.g., 100-500 employees"
								className=""
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="location" className="text-white">Location</Label>
						<Input
							id="location"
							{...register( 'location' )}
							placeholder="e.g., San Francisco, CA"
							className=""
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description" className="text-white">Description</Label>
						<textarea
							id="description"
							{...register( 'description' )}
							placeholder="Company description, mission, or additional notes..."
							className="w-full h-24 px-3 py-2 border border-white/[0.10] bg-white/[0.04] backdrop-blur-xl rounded-input focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-transparent resize-none text-white placeholder-violet-300/40"
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
							{isSubmitting? 'Updating...':'Update Company'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
