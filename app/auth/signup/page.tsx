'use client'

import { Button } from '@/components/ui/button'
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePasskeyAuth } from '@/hooks/use-passkey-auth'
import { ArrowLeft,Fingerprint,Key,Mail,Shield,User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignUpPage () {
	const router=useRouter()
	const [ isLoading,setIsLoading ]=useState( false )
	const [ step,setStep ]=useState( 1 )
	const [ userId,setUserId ]=useState<string|null>( null )
	const [ formData,setFormData ]=useState( {
		email: '',
		password: '',
		name: '',
		masterPassword: '',
		confirmMasterPassword: '',
	} )
	const { isSupported,registerPasskey,setupMasterPassword }=usePasskeyAuth()

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

			setUserId( data.userId )
			setStep( 2 )
			setIsLoading( false )
		} catch ( error ) {
			console.error( 'Sign up error:',error )
			setError( 'An unexpected error occurred. Please try again.' )
			setIsLoading( false )
		}
	}

	const handleMasterPasswordSetup=async ( e: React.FormEvent ) => {
		e.preventDefault()
		setIsLoading( true )
		setError( null )

		if ( formData.masterPassword!==formData.confirmMasterPassword ) {
			setError( 'Master passwords do not match' )
			setIsLoading( false )
			return
		}

		if ( formData.masterPassword.length<12 ) {
			setError( 'Master password must be at least 12 characters long' )
			setIsLoading( false )
			return
		}

		try {
			await setupMasterPassword( formData.masterPassword )
			setStep( 3 )
			setIsLoading( false )
		} catch ( error ) {
			console.error( 'Master password setup error:',error )
			setError( 'Failed to setup master password. Please try again.' )
			setIsLoading( false )
		}
	}

	const handlePasskeySetup=async () => {
		setIsLoading( true )
		setError( null )

		try {
			await registerPasskey( formData.email,formData.name )
			router.push( '/dashboard?message=Account created successfully! Your passkey has been registered.' )
		} catch ( error ) {
			console.error( 'Passkey setup error:',error )
			setError( 'Failed to setup passkey. You can set it up later in your profile.' )
			setTimeout( () => {
				router.push( '/dashboard?message=Account created successfully!' )
			},2000 )
		} finally {
			setIsLoading( false )
		}
	}

	const skipPasskeySetup=() => {
		router.push( '/dashboard?message=Account created successfully!' )
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
			{/* Background decorations */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 rounded-full blur-3xl" />
				<div className="absolute top-40 right-32 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
				<div className="absolute bottom-32 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
			</div>

			<Card className="w-full max-w-md glass-elevated relative z-10">
				<CardHeader className="text-center space-y-4">
					<Link href="/" className="inline-flex items-center text-sm text-violet-200/60 hover:text-white mb-4 transition-colors">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Home
					</Link>
					<div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-glow-violet">
						<img src="/favicon.svg" alt="CodeniWork" className="w-10 h-10" />
					</div>
					<CardTitle className="text-3xl font-bold text-gradient-heading">
						Join CodeniWork
					</CardTitle>
					<CardDescription className="text-violet-200/60">
						Create your account to start organizing your career with CodeniWork
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Progress Indicator */}
					<div className="flex items-center justify-center space-x-2 mb-6">
						<div className={`w-3 h-3 rounded-full transition-colors ${step>=1? 'bg-violet-500 shadow-glow-violet':'bg-white/[0.10]'}`} />
						<div className={`w-8 h-0.5 transition-colors ${step>=2? 'bg-violet-500':'bg-white/[0.10]'}`} />
						<div className={`w-3 h-3 rounded-full transition-colors ${step>=2? 'bg-violet-500 shadow-glow-violet':'bg-white/[0.10]'}`} />
						<div className={`w-8 h-0.5 transition-colors ${step>=3? 'bg-violet-500':'bg-white/[0.10]'}`} />
						<div className={`w-3 h-3 rounded-full transition-colors ${step>=3? 'bg-violet-500 shadow-glow-violet':'bg-white/[0.10]'}`} />
					</div>

					{/* Error Display */}
					{error&&(
						<div className="bg-red-500/10 border border-red-500/20 rounded-card p-4 mb-4">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-red-300">{error}</p>
								</div>
							</div>
						</div>
					)}

					{/* Step 1: Basic Information */}
					{step===1&&(
						<form onSubmit={handleEmailSignUp} className="space-y-4">
							<div className="text-center mb-4">
								<h3 className="text-lg font-semibold text-white">Basic Information</h3>
								<p className="text-sm text-violet-200/60">Let's start with your basic details</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-300/40 w-4 h-4" />
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
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-300/40 w-4 h-4" />
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
								className="w-full h-12 text-lg font-medium"
							>
								{isLoading? 'Creating Account...':'Continue'}
							</Button>
						</form>
					)}

					{/* Step 2: Master Password Setup */}
					{step===2&&(
						<form onSubmit={handleMasterPasswordSetup} className="space-y-4">
							<div className="text-center mb-4">
								<Shield className="w-12 h-12 text-violet-400 mx-auto mb-2" />
								<h3 className="text-lg font-semibold text-white">Setup Master Password</h3>
								<p className="text-sm text-violet-200/60">This will encrypt your sensitive data</p>
							</div>

							<div className="bg-indigo-500/10 border border-indigo-500/20 rounded-card p-4 mb-4">
								<div className="flex items-start">
									<div className="flex-shrink-0">
										<svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
										</svg>
									</div>
									<div className="ml-3">
										<p className="text-sm text-indigo-200">
											Your master password encrypts sensitive data like job application notes and documents.
											Make it strong and memorable - you'll need it to access your encrypted data.
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="masterPassword">Master Password</Label>
								<div className="relative">
									<Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-300/40 w-4 h-4" />
									<Input
										id="masterPassword"
										name="masterPassword"
										type="password"
										placeholder="Create a strong master password"
										value={formData.masterPassword}
										onChange={handleInputChange}
										className="pl-10"
										required
										minLength={12}
									/>
								</div>
								<p className="text-xs text-violet-200/40">Minimum 12 characters</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmMasterPassword">Confirm Master Password</Label>
								<div className="relative">
									<Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-300/40 w-4 h-4" />
									<Input
										id="confirmMasterPassword"
										name="confirmMasterPassword"
										type="password"
										placeholder="Confirm your master password"
										value={formData.confirmMasterPassword}
										onChange={handleInputChange}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-12 text-lg font-medium"
							>
								{isLoading? 'Setting up...':'Setup Master Password'}
							</Button>
						</form>
					)}

					{/* Step 3: Passkey Setup */}
					{step===3&&(
						<div className="space-y-4">
							<div className="text-center mb-4">
								<Fingerprint className="w-12 h-12 text-violet-400 mx-auto mb-2" />
								<h3 className="text-lg font-semibold text-white">Setup Passkey</h3>
								<p className="text-sm text-violet-200/60">Secure, passwordless authentication</p>
							</div>

							{!isSupported&&(
								<div className="bg-amber-500/10 border border-amber-500/20 rounded-card p-4 mb-4">
									<div className="flex items-start">
										<div className="flex-shrink-0">
											<svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
											</svg>
										</div>
										<div className="ml-3">
											<p className="text-sm text-amber-200">
												Passkeys are not supported in your current browser. You can still use your account with email and password.
											</p>
										</div>
									</div>
								</div>
							)}

							<div className="bg-emerald-500/10 border border-emerald-500/20 rounded-card p-4 mb-4">
								<div className="flex items-start">
									<div className="flex-shrink-0">
										<svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
									</div>
									<div className="ml-3">
										<p className="text-sm text-emerald-200">
											Passkeys provide secure, phishing-resistant authentication using your device's biometrics or PIN.
											You can always add more passkeys later.
										</p>
									</div>
								</div>
							</div>

							{isSupported&&(
								<Button
									onClick={handlePasskeySetup}
									disabled={isLoading}
									className="w-full h-12 text-lg font-medium"
								>
									{isLoading? 'Setting up Passkey...':'Setup Passkey'}
								</Button>
							)}

							<Button
								onClick={skipPasskeySetup}
								variant="outline"
								className="w-full h-12 text-lg font-medium"
							>
								{isSupported? 'Skip for Now':'Continue to Dashboard'}
							</Button>
						</div>
					)}

					{/* Success message display */}
					<div className="text-center text-sm text-violet-200/60">
						<p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
					</div>

					{/* Sign In Link */}
					<div className="text-center text-sm text-violet-200/60">
						Already have an account?{' '}
						<Link href="/auth/signin" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
							Sign in here
						</Link>
					</div>

					{/* Terms */}
					<div className="text-center text-xs text-violet-200/40">
						By creating an account, you agree to our{' '}
						<Link href="/terms" className="text-violet-400/70 hover:text-violet-300">
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link href="/privacy" className="text-violet-400/70 hover:text-violet-300">
							Privacy Policy
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
