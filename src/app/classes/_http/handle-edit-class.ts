'use server'
import type { GenericClassFormType } from '@/schemas'
import { getAccessToken } from '@auth0/nextjs-auth0'

export async function handleEditClass(data: GenericClassFormType, id: string) {
  const accessToken = await getAccessToken()

  const bodyData = {
    id: id,
    name: data.name,
  }

  try {
    const req = await fetch(`${process.env.BACKEND_URL}/classes`, {
      method: 'PUT',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })

    if (!req.ok) {
      const errorResponse = await req.text()
      return Promise.reject(new Error(JSON.parse(errorResponse).error))
    }
  } catch (e) {
    return Promise.reject(new Error('Houve um erro ao editar a turma.'))
  }
}
