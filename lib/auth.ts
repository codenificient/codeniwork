import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers,auth,signIn,signOut }=NextAuth( {
	providers: [
		GitHub( {
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		} ),
		Google( {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
