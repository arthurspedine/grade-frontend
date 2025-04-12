'use server'
import type { FetchOptions } from '@/types'
import { getToken } from './get-token'

export async function authenticatedFetch<T>(
  endpoint: string,
  options: FetchOptions = { method: 'GET' },
  tags?: string[]
): Promise<T> {
  try {
    const accessToken = await getToken()

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
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
      return response.json()
    }
    return {} as Promise<T>
  } catch (error) {
    console.error(`Error in authenticated fetch to ${endpoint}:`, error)
    return Promise.reject(
      new Error('Houve um erro, tente novamente mais tarde.')
    )
  }
}
