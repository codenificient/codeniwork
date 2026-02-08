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
			"relative h-screen bg-white/[0.03] backdrop-blur-2xl border-r border-white/[0.06] transition-all duration-300",
			isCollapsed? "w-16":"w-64",
			className
		)}>
			{/* Content */}
			<div className="relative z-10 h-full flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
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
						className="text-violet-200 hover:bg-white/[0.06] hover:text-white p-1"
					>
						{isCollapsed? <ChevronRight className="w-4 h-4" />:<ChevronLeft className="w-4 h-4" />}
					</Button>
				</div>

				{/* Navigation Menu */}
				<nav className="flex-1 px-3 py-4 space-y-1">
					{menuItems.map( ( item ) => {
						const Icon=item.icon
						const isActive=pathname===item.href
						return (
							<Link
								key={item.title}
								href={item.href}
								className={cn(
									"flex items-center space-x-3 px-3 py-2.5 rounded-button text-white/80 transition-all duration-200 group",
									isActive
										? "bg-white/[0.08] text-white border border-white/[0.10] shadow-glass"
										:"hover:bg-white/[0.04] hover:text-white"
								)}
							>
								<div className={cn(
									"p-1.5 rounded-lg transition-all duration-200",
									isActive
										? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20"
										:"text-violet-300/70 group-hover:text-violet-200"
								)}>
									<Icon className="w-4 h-4" />
								</div>
								{!isCollapsed&&(
									<span className={cn(
										"text-sm font-medium transition-all duration-200",
										isActive? "text-white":"text-violet-200/80 group-hover:text-white"
									)}>
										{item.title}
									</span>
								)}
							</Link>
						)
					} )}
				</nav>

				{/* Footer */}
				<div className="p-3 border-t border-white/[0.06]">
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-violet-200/70 hover:bg-white/[0.04] hover:text-white justify-start"
					>
						<Settings className="w-4 h-4 mr-3" />
						{!isCollapsed&&<span className="text-sm">Settings</span>}
					</Button>
				</div>
			</div>
		</div>
	)
}
