'use server'
import type { FetchOptions } from '@/types'
import { getToken } from './get-token'

export async function authenticatedFetch<T>(
  endpoint: string,
  options: FetchOptions = { method: 'GET' }
): Promise<T> {
  try {
    const accessToken = await getToken()

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body && { 'Content-Type': 'application/json' }),
    }

    const response = await fetch(`${process.env.BACKEND_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      cache: 'no-cache',
      headers: headers,
      ...(options.body && { body: JSON.stringify(options.body) }),
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
