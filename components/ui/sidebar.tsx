'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	BarChart3,
	Briefcase,
	Building2,
	Calendar,
	ChevronLeft,
	ChevronRight,
	FileText,
	Settings,
	Target,
	Users,
	Zap
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface SidebarProps {
	className?: string
}

const menuItems=[
	{
		title: 'Dashboard',
		icon: BarChart3,
		href: '/dashboard',
		active: false
	},
	{
		title: 'Applications',
		icon: Briefcase,
		href: '/dashboard/applications'
	},
	{
		title: 'Companies',
		icon: Building2,
		href: '/dashboard/companies'
	},
	{
		title: 'Calendar',
		icon: Calendar,
		href: '/dashboard/calendar'
	},
	{
		title: 'Analytics',
		icon: Target,
		href: '/dashboard/analytics'
	},
	{
		title: 'Documents',
		icon: FileText,
		href: '/dashboard/documents'
	},
	{
		title: 'Contacts',
		icon: Users,
		href: '/dashboard/contacts'
	},
	{
		title: 'Quick Actions',
		icon: Zap,
		href: '/dashboard/quick-actions'
	}
]

export function Sidebar ( { className }: SidebarProps ) {
	const [ isCollapsed,setIsCollapsed ]=useState( false )
	const pathname=usePathname()

	return (
		<div className={cn(
			"relative h-screen bg-gradient-to-b from-purple-800 via-purple-700 to-purple-900 transition-all duration-300",
			isCollapsed? "w-16":"w-64",
			className
		)}>
			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-purple-800/95 via-purple-700/95 to-purple-900/95 backdrop-blur-sm" />

			{/* Content */}
			<div className="relative z-10 h-full flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-white/20">
					{!isCollapsed&&(
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded-lg flex items-center justify-center">
								<img src="/favicon.svg" alt="CodeniWork" className="w-6 h-6" />
							</div>
							<span className="text-white font-semibold text-lg">CodeniWork</span>
						</div>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsCollapsed( !isCollapsed )}
						className="text-white hover:bg-white/20 p-1"
					>
						{isCollapsed? <ChevronRight className="w-4 h-4" />:<ChevronLeft className="w-4 h-4" />}
					</Button>
				</div>

				{/* Navigation Menu */}
				<nav className="flex-1 px-3 py-4 space-y-2">
					{menuItems.map( ( item ) => {
						const Icon=item.icon
						const isActive=pathname===item.href
						return (
							<Link
								key={item.title}
								href={item.href}
								className={cn(
									"flex items-center space-x-3 px-3 py-3 rounded-xl text-white transition-all duration-200 group",
									isActive
										? "bg-gradient-to-r from-purple-600/80 to-purple-700/80 shadow-lg backdrop-blur-sm border border-purple-400/30"
										:"hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-700/40 hover:shadow-md"
								)}
							>
								<div className={cn(
									"p-2 rounded-lg transition-all duration-200",
									isActive
										? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
										:"bg-white/20 text-white/80 group-hover:bg-gradient-to-r group-hover:from-purple-500/60 group-hover:to-blue-600/60 group-hover:text-white"
								)}>
									<Icon className="w-5 h-5" />
								</div>
								{!isCollapsed&&(
									<span className={cn(
										"font-medium transition-all duration-200",
										isActive? "text-white":"text-white/90 group-hover:text-white"
									)}>
										{item.title}
									</span>
								)}
							</Link>
						)
					} )}
				</nav>

				{/* Footer */}
				<div className="p-3 border-t border-white/20">
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-white hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-purple-700/40 justify-start"
					>
						<Settings className="w-5 h-5 mr-3" />
						{!isCollapsed&&<span>Settings</span>}
					</Button>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-20 left-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
			<div className="absolute top-32 right-6 w-3 h-3 bg-purple-300 rounded-full animate-pulse delay-100" />
			<div className="absolute top-48 left-8 w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200" />
			<div className="absolute bottom-32 right-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300" />
		</div>
	)
}
