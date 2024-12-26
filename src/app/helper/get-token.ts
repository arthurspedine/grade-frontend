'use server'

import { cookies } from 'next/headers'

export async function getToken(): Promise<string> {
  const c = await cookies()

  const tokenResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/token`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        Cookie: c.toString(),
      },
    }
  )

  if (!tokenResponse.ok) {
    console.error('Token response status:', tokenResponse.status)
    console.error('Token response statusText:', tokenResponse.statusText)
    throw new Error(`Failed to get access token: ${tokenResponse.status}`)
  }

  const { accessToken } = await tokenResponse.json()

  if (!accessToken) {
    throw new Error('No access token received')
  }

  return accessToken
}
