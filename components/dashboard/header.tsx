'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Bell,LogOut,Menu,Search,Settings,User,X } from 'lucide-react'
import { signOut,useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect,useRef,useState } from 'react'

export function DashboardHeader () {
	const { data: session,status }=useSession()
	const isLoading=status==="loading"
	const [ isMenuOpen,setIsMenuOpen ]=useState( false )
	const [ searchQuery,setSearchQuery ]=useState( '' )
	const router=useRouter()
	const menuRef=useRef<HTMLDivElement>( null )

	// Debug logging for session data
	useEffect( () => {
		if ( session ) {
			console.log( 'Better Auth session:',session )
			console.log( 'Session user:',session.user )
		}
	},[ session ] )

	// Close menu when clicking outside
	useEffect( () => {
		const handleClickOutside=( event: MouseEvent ) => {
			if ( menuRef.current&&!menuRef.current.contains( event.target as Node ) ) {
				setIsMenuOpen( false )
			}
		}

		document.addEventListener( 'mousedown',handleClickOutside )
		return () => {
			document.removeEventListener( 'mousedown',handleClickOutside )
		}
	},[] )

	const handleSignOut=async () => {
		try {
			await signOut( { callbackUrl: '/' } )
		} catch ( error ) {
			console.error( 'Error signing out:',error )
		}
	}

	// Prevent hydration mismatch by not rendering until session is loaded
	if ( isLoading ) {
		return (
			<header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
				<div className="px-6 py-4">
					<div className="flex items-center justify-between max-w-6xl mx-auto">
						<div className="flex flex-1 max-w-md">
							<div className="relative w-full">
								<div className="w-full h-10 bg-white/20 rounded-md animate-pulse"></div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
							<div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
							<div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
						</div>
					</div>
				</div>
			</header>
		)
	}

	return (
		<header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
			<div className="px-6 py-4">
				<div className="flex items-center justify-between max-w-6xl mx-auto">
					{/* Search Bar */}
					<div className="flex flex-1 max-w-md">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<Input
								type="text"
								placeholder="Search applications, companies..."
								value={searchQuery}
								onChange={( e ) => setSearchQuery( e.target.value )}
								className="pl-10 bg-white/20 border-white/30 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm text-white placeholder-blue-200"
							/>
						</div>
					</div>

					{/* User Menu and Actions */}
					<div className="flex items-center space-x-4">
						{/* Notifications */}
						<Button
							variant="ghost"
							size="icon"
							className="relative text-blue-200 hover:text-white hover:bg-white/20"
						>
							<Bell className="w-5 h-5" />
							<span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
						</Button>

						{/* Settings */}
						<Button
							variant="ghost"
							size="icon"
							className="text-blue-200 hover:text-white hover:bg-white/20"
						>
							<Settings className="w-5 h-5" />
						</Button>

						{/* User Menu */}
						<div className="relative" ref={menuRef}>
							{isLoading? (
								<div className="w-8 h-8 bg-blue-200/50 rounded-full animate-pulse"></div>
							):session?.user? (
								<Button
									variant="ghost"
									onClick={() => setIsMenuOpen( !isMenuOpen )}
									className="flex items-center space-x-2 text-blue-200 hover:text-white hover:bg-white/20"
								>
									{session.user.image? (
										<img
											src={session.user.image}
											alt={session.user.name||session.user.email||'User'}
											className="w-8 h-8 rounded-full"
										/>
									):(
										<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
											<User className="w-4 h-4 text-white" />
										</div>
									)}
									<span className="hidden md:block font-medium text-white">
										{session.user.name||session.user.email||'User'}
									</span>
								</Button>
							):(
								<Button
									variant="ghost"
									onClick={() => router.push( '/auth/signin' )}
									className="flex items-center space-x-2 text-blue-200 hover:text-white hover:bg-white/20"
								>
									<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
										<User className="w-4 h-4 text-white" />
									</div>
									<span className="hidden md:block font-medium text-white">
										Sign In
									</span>
								</Button>
							)}

							{/* Dropdown Menu */}
							{isMenuOpen&&session?.user&&(
								<Card className="absolute right-0 mt-2 w-48 py-2 shadow-xl border-white/20 bg-blue-900/95 backdrop-blur-sm">
									<div className="px-4 py-2 border-b border-blue-200/30">
										<p className="text-sm font-medium text-white">
											{session.user?.name||session.user?.email||'User'}
										</p>
										<p className="text-xs text-blue-200">
											{session.user?.email||'No email'}
										</p>
									</div>
									<div className="py-1">
										<button
											onClick={() => {
												router.push( '/profile' )
												setIsMenuOpen( false )
											}}
											className="flex items-center w-full px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/80 transition-colors"
										>
											<User className="w-4 h-4 mr-2" />
											Profile Settings
										</button>
										<button
											onClick={handleSignOut}
											className="flex items-center w-full px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/80 transition-colors"
										>
											<LogOut className="w-4 h-4 mr-2" />
											Sign Out
										</button>
									</div>
								</Card>
							)}
						</div>

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsMenuOpen( !isMenuOpen )}
							className="md:hidden text-blue-200 hover:text-white hover:bg-white/20"
						>
							{isMenuOpen? (
								<X className="w-5 h-5" />
							):(
								<Menu className="w-5 h-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Search */}
				{isMenuOpen&&(
					<div className="md:hidden mt-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 w-4 h-4" />
							<Input
								type="text"
								placeholder="Search applications, companies..."
								value={searchQuery}
								onChange={( e ) => setSearchQuery( e.target.value )}
								className="pl-10 bg-white/20 border-white/30 text-white placeholder-blue-200"
							/>
						</div>
					</div>
				)}
			</div>
		</header>
	)
}
