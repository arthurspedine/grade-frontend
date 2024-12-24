'use server'

import { getAccessToken } from '@auth0/nextjs-auth0'

export async function handleDisableClass(id: string) {
  const accessToken = await getAccessToken()

  try {
    const req = await fetch(`${process.env.BACKEND_URL}/classes?id=${id}`, {
      method: 'DELETE',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
      },
    })

    if (!req.ok) {
      const errorResponse = await req.text()
      return Promise.reject(new Error(JSON.parse(errorResponse).error))
    }
  } catch (e) {
    return Promise.reject(new Error('Houve um erro ao desativar a turma.'))
  }
}
