import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { JWT } from 'next-auth/jwt'

interface GoogleProfile extends Record<string, unknown> {
  email_verified?: boolean
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      // biome-ignore lint/style/noNonNullAssertion:
      clientId: process.env.GOOGLE_CLIENT_ID!,
      // biome-ignore lint/style/noNonNullAssertion:
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope: 'openid email profile',
        },
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, account, user }) {
      // initial login
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : 0,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          },
        }
      }

      if (!token.accessTokenExpires) {
        return await refreshAccessToken(token)
      }

      // token still valid
      const now = Date.now()
      const tokenExpiresIn = token.accessTokenExpires - now
      const fiveMinutesInMs = 5 * 60 * 1000

      if (tokenExpiresIn > fiveMinutesInMs) {
        return token
      }

      // token expired, try refresh
      try {
        return await refreshAccessToken(token)
      } catch (error) {
        console.error('Error refreshing access token:', error)
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        }
      }
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken
        session.idToken = token.idToken
        session.error = token.error
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }

      if (new URL(url).origin === baseUrl) {
        return url
      }
      return `${baseUrl}/`
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const googleProfile = profile as GoogleProfile
        if (googleProfile?.email_verified !== true) {
          return false
        }
      }

      return true
    },
  },

  events: {
    async signIn({ user, account, profile }) {
      console.log(`User ${user.email} signed in with ${account?.provider}`)
    },

    async signOut({ token }) {
      console.debug('User signed out')
    },

    async session({ session, token }) {
      if (token.error) {
        console.error('Session error:', token.error)
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',

  // Cookie config
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      }
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        // biome-ignore lint/style/noNonNullAssertion:
        client_id: process.env.GOOGLE_CLIENT_ID!,
        // biome-ignore lint/style/noNonNullAssertion:
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
      method: 'POST',
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      console.error('Error refreshing token:', refreshedTokens)
      throw new Error(refreshedTokens.error || 'Error refreshing token')
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token || token.idToken,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    }
  } catch (error) {
    console.error('Error trying to refresh the token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
