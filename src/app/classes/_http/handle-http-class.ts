'use server'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import type { ClassType } from '@/types'

export async function handleClassesList() {
  return authenticatedFetch<ClassType[]>('/classes')
}

export async function addClass(formData: FormData) {
  return authenticatedFetch<void>('/classes', {
    method: 'POST',
    body: formData,
  })
}

export async function updateClass(classData: FormData) {
  return authenticatedFetch<void>('/classes', {
    method: 'PUT',
    body: classData,
  })
}

export async function disableClass(id: string) {
  return authenticatedFetch<void>(`/classes?id=${id}`, {
    method: 'DELETE',
  })
}
