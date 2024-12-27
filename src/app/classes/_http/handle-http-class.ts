'use server'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type { GenericClassFormType } from '@/schemas'
import type { ClassType } from '@/types'

export async function handleClassesList() {
  return authenticatedFetch<ClassType[]>('/classes')
}

export async function addClass(classData: GenericClassFormType) {
  return authenticatedFetch<void>('/classes', {
    method: 'POST',
    body: classData,
  })
}

export async function updateClass(id: string, classData: GenericClassFormType) {
  const bodyData = {
    id: id,
    name: classData.name,
  }
  return authenticatedFetch<void>('/classes', {
    method: 'PUT',
    body: bodyData,
  })
}

export async function disableClass(id: string) {
  return authenticatedFetch<void>(`/classes?id=${id}`, {
    method: 'DELETE',
  })
}
