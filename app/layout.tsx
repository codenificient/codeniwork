import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter=Inter( { subsets: [ 'latin' ] } )

export const metadata: Metadata={
	title: 'CodeniWork - Job Application Tracker',
	description: 'Track your career with CodeniWork - a beautiful, modern job application tracker inspired by Clean My Mac',
	keywords: [ 'codeniwork','job tracker','application tracker','career management','job search' ],
	authors: [ { name: 'CodeniWork Team' } ],
	viewport: 'width=device-width, initial-scale=1',
	manifest: '/manifest.json',
	icons: {
		icon: [
			{ url: '/favicon.svg',type: 'image/svg+xml' }
		],
		apple: '/apple-touch-icon.svg',
	},
}

export default function RootLayout ( {
	children,
}: {
	children: React.ReactNode
} ) {
	return (
		<html lang="en" className="h-full">
			<body className={`${inter.className} h-full`}>
				<AuthProvider>
					{children}
					<Toaster />
				</AuthProvider>
			</body>
		</html>
	)
}
