'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { Camera, Save, User, Lock, Image as ImageIcon } from 'lucide-react'

export default function ProfilePage() {
	const { data: session, update } = useSession()
	const router = useRouter()
	const { toast } = useToast()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: session?.user?.name || '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	const [profileImage, setProfileImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(session?.user?.image || null)

	// Redirect if not authenticated
	if (!session?.user) {
		router.push('/auth/signin')
		return null
	}

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			// Validate file type
			if (!file.type.startsWith('image/')) {
				toast({
					title: 'Invalid file type',
					description: 'Please select an image file (JPEG, PNG, etc.)',
					variant: 'destructive',
				})
				return
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast({
					title: 'File too large',
					description: 'Please select an image smaller than 5MB',
					variant: 'destructive',
				})
				return
			}

			setProfileImage(file)
			
			// Create preview URL
			const url = URL.createObjectURL(file)
			setPreviewUrl(url)
		}
	}

	const handleImageUpload = async (): Promise<string | null> => {
		if (!profileImage) return null

		try {
			// Create FormData for file upload
			const formData = new FormData()
			formData.append('file', profileImage)
			formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'codeniwork_profile')

			// Upload to Cloudinary
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'codeniwork'}/image/upload`,
				{
					method: 'POST',
					body: formData,
				}
			)

			if (!response.ok) {
				throw new Error('Failed to upload image')
			}

			const data = await response.json()
			return data.secure_url
		} catch (error) {
			console.error('Error uploading image:', error)
			toast({
				title: 'Image upload failed',
				description: 'Failed to upload profile image. Please try again.',
				variant: 'destructive',
			})
			return null
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Validate passwords if changing
			if (formData.newPassword || formData.currentPassword) {
				if (!formData.currentPassword) {
					toast({
						title: 'Current password required',
						description: 'Please enter your current password to change it.',
						variant: 'destructive',
					})
					return
				}

				if (formData.newPassword !== formData.confirmPassword) {
					toast({
						title: 'Passwords do not match',
						description: 'New password and confirmation password must match.',
						variant: 'destructive',
					})
					return
				}

				if (formData.newPassword.length < 6) {
					toast({
						title: 'Password too short',
						description: 'New password must be at least 6 characters long.',
						variant: 'destructive',
					})
					return
				}
			}

			// Upload image first if selected
			let imageUrl = null
			if (profileImage) {
				imageUrl = await handleImageUpload()
				if (!imageUrl) {
					setIsLoading(false)
					return
				}
			}

			// Prepare update data
			const updateData: any = {
				name: formData.name,
			}

			if (imageUrl) {
				updateData.image = imageUrl
			}

			if (formData.newPassword && formData.currentPassword) {
				updateData.currentPassword = formData.currentPassword
				updateData.newPassword = formData.newPassword
			}

			// Update profile via API
			const response = await fetch('/api/profile/update', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'Failed to update profile')
			}

			const updatedUser = await response.json()

			// Update session
			await update({
				...session,
				user: {
					...session.user,
					name: updatedUser.name,
					image: updatedUser.image,
				},
			})

			toast({
				title: 'Profile updated successfully!',
				description: 'Your profile has been updated.',
			})

			// Reset form
			setFormData({
				name: updatedUser.name,
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			})
			setProfileImage(null)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}

		} catch (error) {
			console.error('Error updating profile:', error)
			toast({
				title: 'Update failed',
				description: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						Profile Settings
					</h1>
					<p className="text-gray-300 mt-2">
						Update your personal information and account settings
					</p>
				</div>

				<Card className="bg-gray-900/95 backdrop-blur-sm border border-gray-700">
					<CardHeader>
						<CardTitle className="text-white flex items-center space-x-2">
							<User className="w-5 h-5" />
							<span>Personal Information</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Profile Picture Section */}
							<div className="space-y-4">
								<Label className="text-white">Profile Picture</Label>
								<div className="flex items-center space-x-4">
									<div className="relative">
										<div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
											{previewUrl ? (
												<img
													src={previewUrl}
													alt="Profile"
													className="w-full h-full object-cover"
												/>
											) : (
												<User className="w-12 h-12 text-white" />
											)}
										</div>
										<Button
											type="button"
											size="sm"
											variant="outline"
											className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-gray-800 border-gray-600 hover:bg-gray-700"
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
											onChange={handleImageSelect}
											className="hidden"
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() => fileInputRef.current?.click()}
											className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
										>
											<ImageIcon className="w-4 h-4 mr-2" />
											Choose Image
										</Button>
										<p className="text-sm text-gray-400 mt-1">
											JPEG, PNG up to 5MB
										</p>
									</div>
								</div>
							</div>

							{/* Name Section */}
							<div className="space-y-2">
								<Label htmlFor="name" className="text-white">Full Name</Label>
								<Input
									id="name"
									type="text"
									value={formData.name}
									onChange={(e) => handleInputChange('name', e.target.value)}
									className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
									placeholder="Enter your full name"
								/>
							</div>

							{/* Password Section */}
							<div className="space-y-4">
								<div className="flex items-center space-x-2">
									<Lock className="w-5 h-5 text-white" />
									<Label className="text-white">Change Password</Label>
								</div>
								
								<div className="space-y-2">
									<Label htmlFor="currentPassword" className="text-white">Current Password</Label>
									<Input
										id="currentPassword"
										type="password"
										value={formData.currentPassword}
										onChange={(e) => handleInputChange('currentPassword', e.target.value)}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
										placeholder="Enter current password"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="newPassword" className="text-white">New Password</Label>
									<Input
										id="newPassword"
										type="password"
										value={formData.newPassword}
										onChange={(e) => handleInputChange('newPassword', e.target.value)}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
										placeholder="Enter new password"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={formData.confirmPassword}
										onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
										placeholder="Confirm new password"
									/>
								</div>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
							>
								{isLoading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
										Updating...
									</>
								) : (
									<>
										<Save className="w-4 h-4 mr-2" />
										Update Profile
									</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
