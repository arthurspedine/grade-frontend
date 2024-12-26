import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextResponse } from 'next/server'

export const GET = withApiAuthRequired(async function getToken(req) {
  try {
    const res = new NextResponse()
    const { accessToken } = await getAccessToken(req, res, {
      scopes: [],
    })
    return NextResponse.json({ accessToken }, res)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 401 }
    )
  }
})
