'use server'
import type { FetchOptions } from '@/types'
import { auth0 } from '@/lib/auth0'

export async function authenticatedFetch<T>(
  endpoint: string,
  options: FetchOptions = { method: 'GET' },
  tags?: string[]
): Promise<T> {
  try {
    const { token } = await auth0.getAccessToken()

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
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
      const errorResponse = await response.text()
      return Promise.reject(new Error(JSON.parse(errorResponse).error))
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
