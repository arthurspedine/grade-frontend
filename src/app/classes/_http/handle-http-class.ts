'use server'
import { authenticatedFetch } from '@/helper/authenticated-fetch'
import { LIST_CLASSES_TAG } from '@/tags'
import type { ClassType } from '@/types'
import { revalidateTag } from 'next/cache'

export async function handleClassesList() {
  return authenticatedFetch<ClassType[]>('/classes', { method: 'GET' }, [
    LIST_CLASSES_TAG,
  ])
}

export async function addClass(formData: FormData) {
  const result = await authenticatedFetch<void>('/classes', {
    method: 'POST',
    body: formData,
  })
  revalidateTag(LIST_CLASSES_TAG)
  return result
}

export async function updateClass(classData: FormData) {
  const result = await authenticatedFetch<void>('/classes', {
    method: 'PUT',
    body: classData,
  })
  revalidateTag(LIST_CLASSES_TAG)
  return result
}

export async function disableClass(id: string) {
  const result = await authenticatedFetch<void>(`/classes?id=${id}`, {
    method: 'DELETE',
  })
  revalidateTag(LIST_CLASSES_TAG)
  return result
}
