import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

export default withApiAuthRequired(async function getToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } = await getAccessToken(req, res, {
      scopes: [],
    })
    return res.json({ accessToken })
  } catch (error) {
    return res.status(401).json({ error: 'Failed to get access token' })
  }
})
