'use client'

import { Button } from '@/components/ui/button'
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft,Mail,User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage () {
	const router=useRouter()
	const [ isLoading,setIsLoading ]=useState( false )
	const [ formData,setFormData ]=useState( {
		email: '',
		password: '',
		name: '',
	} )

	const handleInputChange=( e: React.ChangeEvent<HTMLInputElement> ) => {
		setFormData( {
			...formData,
			[ e.target.name ]: e.target.value,
		} )
	}

	const [ error,setError ]=useState<string|null>( null )

	const handleEmailSignUp=async ( e: React.FormEvent ) => {
		e.preventDefault()
		setIsLoading( true )
		setError( null )

		try {
			const response=await fetch( '/api/auth/signup',{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( {
					email: formData.email,
					password: formData.password,
					name: formData.name,
				} ),
			} )

			const data=await response.json()

			if ( !response.ok ) {
				setError( data.error||'Failed to create account' )
				setIsLoading( false )
				return
			}

			// Account created successfully, redirect to sign in
			router.push( '/auth/signin?message=Account created successfully! Please sign in.' )
		} catch ( error ) {
			console.error( 'Sign up error:',error )
			setError( 'An unexpected error occurred. Please try again.' )
			setIsLoading( false )
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute bottom-32 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
			</div>

			<Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl relative z-10">
				<CardHeader className="text-center space-y-4">
					<Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Home
					</Link>
					<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
						<img src="/favicon.svg" alt="CodeniWork" className="w-10 h-10" />
					</div>
					<CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
						Join CodeniWork
					</CardTitle>
					<CardDescription className="text-gray-600">
						Create your account to start organizing your career with CodeniWork
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Error Display */}
					{error&&(
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-red-800">{error}</p>
								</div>
							</div>
						</div>
					)}

					{/* Email/Password Form */}
					<form onSubmit={handleEmailSignUp} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="Enter your full name"
									value={formData.name}
									onChange={handleInputChange}
									className="pl-10"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="Enter your email"
									value={formData.email}
									onChange={handleInputChange}
									className="pl-10"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Create a password"
								value={formData.password}
								onChange={handleInputChange}
								required
								minLength={8}
							/>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white h-12 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
						>
							{isLoading? 'Creating Account...':'Create Account'}
						</Button>
					</form>

					{/* Success message display */}
					<div className="text-center text-sm text-gray-600">
						<p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
					</div>

					{/* Sign In Link */}
					<div className="text-center text-sm text-gray-600">
						Already have an account?{' '}
						<Link href="/auth/signin" className="text-purple-600 hover:text-purple-700 font-medium">
							Sign in here
						</Link>
					</div>

					{/* Terms */}
					<div className="text-center text-xs text-gray-500">
						By creating an account, you agree to our{' '}
						<Link href="/terms" className="text-purple-600 hover:text-purple-700">
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link href="/privacy" className="text-purple-600 hover:text-purple-700">
							Privacy Policy
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
