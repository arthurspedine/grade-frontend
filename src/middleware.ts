import {
  getSession,
  updateSession,
  withMiddlewareAuthRequired,
} from '@auth0/nextjs-auth0/edge'
import { NextResponse } from 'next/server'

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next()

  try {
    const session = await getSession(req, res)

    if (!session) {
      const returnUrl = req.nextUrl.pathname
      return NextResponse.redirect(
        new URL(
          `/api/auth/login?returnTo=${encodeURIComponent(returnUrl)}`,
          req.url
        )
      )
    }

    const { accessToken, user } = session

    if (!accessToken || isTokenExpired(accessToken)) {
      console.log('Token expirado ou inválido. Atualizando sessão...')
      await updateSession(req, res, {
        ...session,
        user: { ...user },
      })
      const returnUrl = req.nextUrl.pathname
      return NextResponse.redirect(
        new URL(
          `/api/auth/login?returnTo=${encodeURIComponent(returnUrl)}`,
          req.url
        )
      )
    }

    return res
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error)

    const returnUrl = req.nextUrl.pathname
    return NextResponse.redirect(
      new URL(
        `/api/auth/login?returnTo=${encodeURIComponent(returnUrl)}`,
        req.url
      )
    )
  }
})

function isTokenExpired(token: string) {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}

export const config = {
  matcher: [
    '/classes',
    '/classes/:path*',
    '/api/auth/:path*',
    '/assessments',
    '/assessments/:path*',
  ],
}
