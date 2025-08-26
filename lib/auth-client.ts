import { createAuthClient } from "better-auth/client"

export const authClient=createAuthClient( {
	baseURL: process.env.NEXTAUTH_URL||'http://localhost:3000',
} )
