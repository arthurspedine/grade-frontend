'use server'

import { getAccessToken } from '@auth0/nextjs-auth0'

export default async function handleClassesList() {
  const accessToken = await getAccessToken()

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/classes`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch classes, status: ${res.status}`)
    }

    const response = await res.json()

    return response
  } catch (e) {
    console.error('Error fetching classes:', e)

    return { error: 'Unable to retrieve classes at the moment.' }
  }
}
