import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { accounts,sessions,users,verificationTokens } from "./db/schema"

export const auth=betterAuth( {
	database: drizzleAdapter( db,{
		provider: "pg",
		schema: {
			users,
			sessions,
			accounts,
			verificationTokens,
		},
	} ),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		requirePassword: true,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	baseURL: process.env.NEXTAUTH_URL||'http://localhost:3000',
	secret: process.env.BETTER_AUTH_SECRET,
} )
