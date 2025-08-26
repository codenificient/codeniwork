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

				// For now, use a simple check - you can implement proper database authentication later
				// This is a temporary solution to get the credentials provider working
				if ( credentials.email==="test@example.com"&&credentials.password==="password" ) {
					return {
						id: "1",
						email: credentials.email,
						name: "Test User",
						image: null
					}
				}

				return null
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
