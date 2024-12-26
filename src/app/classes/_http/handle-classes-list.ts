'use server'

import { getToken } from '@/app/helper/get-token'

export default async function handleClassesList() {
  const accessToken: string = await getToken()

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/classes`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch classes, status: ${res.status}`)
    }

    const response = await res.json()
    return response
  } catch (e) {
    return { error: 'Unable to retrieve classes at the moment.' }
  }
}
