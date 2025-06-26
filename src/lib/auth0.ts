import { Auth0Client } from '@auth0/nextjs-auth0/server'

let domain = process.env.AUTH0_ISSUER_BASE_URL

if (domain) {
  domain = domain.replace('https://', '')
}

const appBaseUrl = process.env.APP_BASE_URL

const secret = process.env.AUTH0_SECRET

const clientId = process.env.AUTH0_CLIENT_ID

const clientSecret = process.env.AUTH0_CLIENT_SECRET

export const auth0 = new Auth0Client({
  enableAccessTokenEndpoint: false,
  domain: domain || 'grade.use3w.com',
  appBaseUrl: appBaseUrl,
  secret: secret,
  clientId: clientId,
  clientSecret: clientSecret,
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE || 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
})
