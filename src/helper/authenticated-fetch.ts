'use server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import type { FetchOptions } from '@/types'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export async function authenticatedFetch<T>(
  endpoint: string,
  options: FetchOptions = { method: 'GET' },
  tags?: string[]
): Promise<T> {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      console.error('Session not found')
      redirect('/auth/signin')
    }

    if (session.error === 'RefreshAccessTokenError') {
      console.error('Refresh token error, redirecting to login')
      redirect('/auth/signin?error=SessionExpired')
    }

    if (!session.idToken) {
      console.error('ID Token not found in session')
      redirect('/auth/signin?error=TokenMissing')
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session?.idToken}`,
    }

    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(`${process.env.BACKEND_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      cache: 'no-cache',
      headers,
      body:
        options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body),
      next: tags ? { tags } : undefined,
    })

    if (!response.ok) {
      let errorResponse = await response.text()
      if (!errorResponse) {
        errorResponse = 'Unknown error occurred.'
      }
      try {
        const parsed = JSON.parse(errorResponse)
        errorResponse = parsed.error || errorResponse
      } catch {}
      return Promise.reject(new Error(errorResponse))
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const jsonResponse = await response.json()
      return jsonResponse as T
    }
    return {} as Promise<T>
  } catch (error) {
    console.error(`Error in authenticated fetch to ${endpoint}:`, error)
    console.error(`Used body: ${options.body}`)

    return Promise.reject(
      new Error('Houve um erro, tente novamente mais tarde.')
    )
  }
}
