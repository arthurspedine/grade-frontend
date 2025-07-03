import type { DefaultSession, DefaultUser } from 'next-auth'
import type { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    idToken?: string
    error?: string
    user: {
      id?: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string
    idToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
  }
}
