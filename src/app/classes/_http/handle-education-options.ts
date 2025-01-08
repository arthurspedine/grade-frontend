'use server'

import { authenticatedFetch } from '@/helper/authenticated-fetch'

export default async function getCategoryOptions() {
  return authenticatedFetch<Record<string, string>>('/category/list')
}
