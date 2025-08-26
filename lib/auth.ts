import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers,auth,signIn,signOut }=NextAuth( {
	providers: [
		Credentials( {
			name: "credentials",
			credentials: {
				email: { label: "Email",type: "email" },
				password: { label: "Password",type: "password" }
			},
			async authorize ( credentials ) {
				if ( !credentials?.email||!credentials?.password ) {
					return null
				}

				try {
					// Find user by email
					const userResult=await db.select().from( users ).where( eq( users.email,credentials.email as string ) ).limit( 1 )

					if ( userResult.length===0 ) {
						return null
					}

					const user=userResult[ 0 ]

					// Check if user has password hash
					if ( !user.passwordHash ) {
						return null
					}

					// Verify password
					const isPasswordValid=await bcrypt.compare( credentials.password as string,user.passwordHash )

					if ( !isPasswordValid ) {
						return null
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name,
						image: user.image
					}
				} catch ( error ) {
					console.error( "Database error during authentication:",error )
					return null
				}
			}
		} ),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: '/auth/signin',
	},
	callbacks: {
		async jwt ( { token,user } ) {
			if ( user ) {
				token.id=user.id
			}
			return token
		},
		async session ( { session,token } ) {
			if ( token&&session.user ) {
				session.user.id=token.id as string
			}
			return session
		},
		async redirect ( { url,baseUrl } ) {
			// After successful OAuth authentication, always redirect to dashboard
			if ( url.startsWith( '/auth/callback' ) ) {
				return `${baseUrl}/dashboard`
			}
			// For other internal URLs, allow them
			if ( url.startsWith( baseUrl ) ) {
				return url
			}
			// For relative URLs, prepend base URL
			if ( url.startsWith( '/' ) ) {
				return `${baseUrl}${url}`
			}
			// Default to dashboard
			return `${baseUrl}/dashboard`
		},
	},
} )
