import { Auth0Client } from '@auth0/nextjs-auth0/server'

const domain = process.env.AUTH0_ISSUER_BASE_URL

if (!domain) {
  throw new Error('Define AUTH0_ISSUER_BASE_URL env variable')
}

const appBaseUrl = process.env.APP_BASE_URL

if (!appBaseUrl) {
  throw new Error('Define APP_BASE_URL env variable')
}

const secret = process.env.AUTH0_SECRET

if (!secret) {
  throw new Error('Define AUTH0_SECRET env variable')
}

const clientId = process.env.AUTH0_CLIENT_ID

if (!clientId) {
  throw new Error('Define AUTH0_CLIENT_ID env variable')
}

const clientSecret = process.env.AUTH0_CLIENT_SECRET

if (!clientSecret) {
  throw new Error('Define AUTH0_CLIENT_SECRET env variable')
}

export const auth0 = new Auth0Client({
  enableAccessTokenEndpoint: false,
  domain: domain.replace('https://', ''),
  appBaseUrl: appBaseUrl,
  secret: secret,
  clientId: clientId,
  clientSecret: clientSecret,
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE || 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
})
