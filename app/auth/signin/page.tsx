'use client'

import { Button } from '@/components/ui/button'
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/card'
import { ArrowLeft,Chrome,Github } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignInPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	// For now, use a default callback URL
	// In a real app, you might want to handle this differently
	const callbackUrl = '/dashboard'

	const handleGoogleSignIn = async () => {
		setIsLoading(true)
		setError(null)
		try {
			await signIn('google', { callbackUrl })
		} catch (error) {
			setError('Google sign-in failed. Please try again.')
			setIsLoading(false)
		}
	}

	const handleGithubSignIn = async () => {
		setIsLoading(true)
		setError(null)
		try {
			await signIn('github', { callbackUrl })
		} catch (error) {
			setError('GitHub sign-in failed. Please try again.')
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
			{/* Colorful Background Elements */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Large gradient circles */}
				<div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute bottom-32 left-1/3 w-72 h-72 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
				{/* Floating orbs */}
				<div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
				<div className="absolute top-1/3 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300" />
				<div className="absolute bottom-1/4 left-1/2 w-5 h-5 bg-green-400 rounded-full animate-bounce delay-700" />
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
						Welcome to CodeniWork
					</CardTitle>
					<CardDescription className="text-gray-600">
						Sign in to continue tracking your career with CodeniWork
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Error Display */}
					{error && (
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

					{/* OAuth Sign In */}
					<div className="space-y-4">
						<p className="text-center text-gray-600 mb-4">
							Sign in with your preferred provider to continue
						</p>
					</div>

					{/* Social Sign In */}
					<div className="space-y-3">
						<Button
							onClick={handleGoogleSignIn}
							disabled={isLoading}
							variant="outline"
							className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 h-12 text-lg font-medium"
						>
							<Chrome className="w-5 h-5 mr-3" />
							Continue with Google
						</Button>

						<Button
							onClick={handleGithubSignIn}
							disabled={isLoading}
							variant="outline"
							className="w-full bg-gray-900 hover:bg-gray-800 text-white border-gray-700 h-12 text-lg font-medium"
						>
							<Github className="w-5 h-5 mr-3" />
							Continue with GitHub
						</Button>
					</div>

					{/* Sign Up Link */}
					<div className="text-center text-sm text-gray-600">
						Don't have an account?{' '}
						<Link href="/auth/signup" className="text-purple-600 hover:text-purple-700 font-medium">
							Sign up here
						</Link>
					</div>

					{/* Terms */}
					<div className="text-center text-xs text-gray-500">
						By signing in, you agree to our{' '}
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
