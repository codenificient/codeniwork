'use client'

import { Button } from '@/components/ui/button'
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { ArrowLeft,Chrome,Github,Mail,User } from 'lucide-react'
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

	const handleEmailSignUp=async ( e: React.FormEvent ) => {
		e.preventDefault()
		setIsLoading( true )

		try {
			console.log( 'Attempting to sign up with:',{ email: formData.email,name: formData.name } )

			const result=await authClient.signUp.email( {
				email: formData.email,
				password: formData.password,
				name: formData.name,
			} )

			console.log( 'Sign up result:',result )

			// If we get here, sign up was successful
			router.push( '/dashboard' )
		} catch ( error ) {
			console.error( 'Sign up error:',error )
			setIsLoading( false )
		}
	}

	const handleGoogleSignUp=async () => {
		setIsLoading( true )
		try {
			await authClient.signIn.social( { provider: 'google' } )
		} catch ( error ) {
			console.error( 'Sign up error:',error )
			setIsLoading( false )
		}
	}

	const handleGithubSignUp=async () => {
		setIsLoading( true )
		try {
			await authClient.signIn.social( { provider: 'github' } )
		} catch ( error ) {
			console.error( 'Sign up error:',error )
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

					{/* Divider */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-gray-500">Or continue with</span>
						</div>
					</div>

					{/* Social Sign Up */}
					<div className="space-y-3">
						<Button
							onClick={handleGoogleSignUp}
							disabled={isLoading}
							variant="outline"
							className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 h-12 text-lg font-medium"
						>
							<Chrome className="w-5 h-5 mr-3" />
							Continue with Google
						</Button>

						<Button
							onClick={handleGithubSignUp}
							disabled={isLoading}
							variant="outline"
							className="w-full bg-gray-900 hover:bg-gray-800 text-white border-gray-700 h-12 text-lg font-medium"
						>
							<Github className="w-5 h-5 mr-3" />
							Continue with GitHub
						</Button>
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
