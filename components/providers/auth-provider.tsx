'use client'

import { ReactNode } from 'react'

interface AuthProviderProps {
	children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	// Better Auth doesn't require a provider wrapper
	// It works directly with the auth client
	return <>{children}</>
}
