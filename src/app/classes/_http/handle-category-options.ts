export default async function getCategoryOptions(): Promise<
  { key: string; label: string }[]
> {
  const response = await fetch(`${process.env.BACKEND_URL}/category/list`, {
    method: 'GET',
    cache: 'no-cache',
  })

  if (!response.ok) {
    const errorResponse = await response.text()
    return Promise.reject(new Error(JSON.parse(errorResponse).error))
  }

  const jsonResponse: Record<string, string> = await response.json()

  const mappedJson = Object.entries(jsonResponse).map(([key, value]) => {
    return {
      key,
      label: value,
    }
  })

  return mappedJson
}
