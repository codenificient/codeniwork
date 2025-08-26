'use client'

import { Button } from '@/components/ui/button'
import { Card,CardDescription,CardHeader,CardTitle } from '@/components/ui/card'
import { ArrowRight,Briefcase,Building2,Calendar,CheckCircle,Users,Zap } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function HomePage () {
	const { data: session,status }=useSession()
	const isLoading=status==="loading"
	const hasSession=!!session

	const handleGetStarted=() => {
		if ( hasSession ) {
			// User is authenticated, go to dashboard
			window.location.href='/dashboard'
		} else {
			// User is not authenticated, go to sign up
			window.location.href='/auth/signup'
		}
	}

	const handleSignIn=() => {
		if ( hasSession ) {
			// User is authenticated, go to dashboard
			window.location.href='/dashboard'
		} else {
			// User is not authenticated, go to sign in
			window.location.href='/auth/signin'
		}
	}

	if ( isLoading ) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
			</div>
		)
	}

	return (
		<div className="min-h-screen relative">
			{/* Navigation */}
			<nav className="px-6 py-4 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 rounded-lg flex items-center justify-center">
						<img src="/favicon.svg" alt="CodeniWork" className="w-6 h-6" />
					</div>
					<span className="text-xl font-bold text-white">CodeniWork</span>
				</div>
				<div className="flex items-center space-x-4">
					<Button
						onClick={handleGetStarted}
						className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
					>
						{hasSession? 'Dashboard':'Get Started'}
					</Button>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="px-6 py-20 text-center">
				<h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
					Track Your Career with CodeniWork
				</h1>
				<p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
					Organize your job search, track applications, and never miss a follow-up.
					Built with a clean, intuitive interface inspired by modern design principles.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						onClick={handleGetStarted}
						size="lg"
						className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-lg px-8 py-6"
					>
						{hasSession? 'Go to Dashboard':'Start Tracking Now'}
						<ArrowRight className="ml-2 w-5 h-5" />
					</Button>
					<Button
						onClick={handleSignIn}
						variant="outline"
						size="lg"
						className="text-lg px-8 py-6 border-2"
					>
						{hasSession? 'Dashboard':'Sign In'}
					</Button>
				</div>
			</div>

			{/* Features Section */}
			<div className="px-6 py-20">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold text-center text-white mb-16">
						Everything you need to manage your job search
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
									<Briefcase className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-white">Application Tracking</CardTitle>
								<CardDescription className="text-blue-100">
									Keep track of all your job applications in one place with detailed status updates.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
									<Building2 className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-white">Company Management</CardTitle>
								<CardDescription className="text-blue-100">
									Store company information, logos, and details for easy reference.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
									<Calendar className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-white">Progress Tracking</CardTitle>
								<CardDescription className="text-blue-100">
									Monitor your application progress from applied to offer with visual indicators.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
									<CheckCircle className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-white">Task Management</CardTitle>
								<CardDescription className="text-blue-100">
									Set reminders and track follow-up tasks to stay on top of your applications.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
									<Users className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-white">Team Collaboration</CardTitle>
								<CardDescription className="text-blue-100">
									Share your progress with mentors or career coaches for guidance.
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
							<CardHeader>
								<div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
									<Zap className="w-6 h-6 text-white" />
								</div>
								<CardTitle className="text-white">Quick Actions</CardTitle>
								<CardDescription className="text-blue-100">
									Fast access to common tasks and quick application entry.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="px-6 py-20 bg-black/20 backdrop-blur-sm border border-white/10">
				<div className="max-w-4xl mx-auto text-center text-white">
					<h2 className="text-3xl font-bold mb-4">
						Ready to take control of your job search?
					</h2>
					<p className="text-xl mb-8 opacity-90">
						Join thousands of job seekers who are already using CodeniWork to organize their applications.
					</p>
					<Button
						onClick={handleGetStarted}
						size="lg"
						variant="secondary"
						className="text-lg px-8 py-6"
					>
						{hasSession? 'Go to Dashboard':'Get Started Free'}
						<ArrowRight className="ml-2 w-5 h-5" />
					</Button>
				</div>
			</div>

			{/* Footer */}
			<footer className="px-6 py-12 bg-gray-900 text-white">
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
					{/* Copyright */}
					<div className="text-center md:text-left mb-4 md:mb-0">
						<div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
							<div className="w-8 h-8 rounded-lg flex items-center justify-center">
								<img src="/favicon.svg" alt="CodeniWork" className="w-6 h-6" />
							</div>
							<span className="text-lg font-bold">CodeniWork</span>
						</div>
						<p className="text-gray-400 mb-4">
							Organize your job search, track applications, and land your dream job.
						</p>
						<p className="text-sm text-gray-500">
							© 2024 CodeniWork. All rights reserved.
						</p>
					</div>

					{/* Made with love */}
					<div className="text-center md:text-right">
						<p className="text-sm text-gray-500">
							Made with ❤️ by <a href="https://tioye.dev" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-300 hover:text-purple-200 transition-colors duration-200 underline decoration-purple-400/50 hover:decoration-purple-300">CodenificienT</a>
						</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
