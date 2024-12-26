import { handleAuth } from '@auth0/nextjs-auth0'

const handler = handleAuth()

// biome-ignore lint/suspicious/noExplicitAny: receive any context
export async function GET(request: Request, context: any) {
  const params = await context.params
  return handler(request, { ...context, params })
}
