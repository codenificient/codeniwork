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
import { useState } from 'react'

interface SidebarProps {
	className?: string
}

const menuItems=[
	{
		title: 'Dashboard',
		icon: BarChart3,
		href: '/',
		active: true
	},
	{
		title: 'Applications',
		icon: Briefcase,
		href: '/applications'
	},
	{
		title: 'Companies',
		icon: Building2,
		href: '/companies'
	},
	{
		title: 'Calendar',
		icon: Calendar,
		href: '/calendar'
	},
	{
		title: 'Analytics',
		icon: Target,
		href: '/analytics'
	},
	{
		title: 'Documents',
		icon: FileText,
		href: '/documents'
	},
	{
		title: 'Contacts',
		icon: Users,
		href: '/contacts'
	},
	{
		title: 'Quick Actions',
		icon: Zap,
		href: '/quick-actions'
	}
]

export function Sidebar ( { className }: SidebarProps ) {
	const [ isCollapsed,setIsCollapsed ]=useState( false )

	return (
		<div className={cn(
			"relative h-screen bg-gradient-to-b from-purple-600 via-blue-600 to-cyan-500 transition-all duration-300",
			isCollapsed? "w-16":"w-64",
			className
		)}>
			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-purple-600/90 via-blue-600/90 to-cyan-500/90 backdrop-blur-sm" />

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
						return (
							<a
								key={item.title}
								href={item.href}
								className={cn(
									"flex items-center space-x-3 px-3 py-3 rounded-xl text-white transition-all duration-200 group",
									item.active
										? "bg-white/20 shadow-lg backdrop-blur-sm"
										:"hover:bg-white/10 hover:shadow-md"
								)}
							>
								<div className={cn(
									"p-2 rounded-lg transition-all duration-200",
									item.active
										? "bg-white/30 text-white"
										:"bg-white/20 text-white/80 group-hover:bg-white/30 group-hover:text-white"
								)}>
									<Icon className="w-5 h-5" />
								</div>
								{!isCollapsed&&(
									<span className={cn(
										"font-medium transition-all duration-200",
										item.active? "text-white":"text-white/90 group-hover:text-white"
									)}>
										{item.title}
									</span>
								)}
							</a>
						)
					} )}
				</nav>

				{/* Footer */}
				<div className="p-3 border-t border-white/20">
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-white hover:bg-white/20 justify-start"
					>
						<Settings className="w-5 h-5 mr-3" />
						{!isCollapsed&&<span>Settings</span>}
					</Button>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-20 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
			<div className="absolute top-32 right-6 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-100" />
			<div className="absolute top-48 left-8 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200" />
			<div className="absolute bottom-32 right-4 w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-300" />
		</div>
	)
}
