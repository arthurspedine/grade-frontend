export type ClassType = {
  id: string
  name: string
  category: string
  active: boolean
}

export type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  // biome-ignore lint/suspicious/noExplicitAny: receive any context
  body?: any
}
