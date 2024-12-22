'use server'
import type { GenericClassFormType } from '@/schemas'
import { getAccessToken } from '@auth0/nextjs-auth0'

export async function handleAddNewClass(data: GenericClassFormType) {
  const accessToken = await getAccessToken()

  try {
    const req = await fetch(`${process.env.BACKEND_URL}/classes`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!req.ok) {
      const errorResponse = await req.text()
      return Promise.reject(new Error(JSON.parse(errorResponse).error))
    }
  } catch (e) {
    return Promise.reject(new Error('Houve um erro ao adicionar a turma.'))
  }
}
