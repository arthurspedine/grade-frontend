'use client'

import { getSession, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface UseAuthOptions {
  redirectOnSuccess?: string
  autoRedirectIfAuthenticated?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const {
    redirectOnSuccess = '/dashboard',
    autoRedirectIfAuthenticated = false,
  } = options

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(
    autoRedirectIfAuthenticated
  )

  const callbackUrl = searchParams?.get('callbackUrl') || redirectOnSuccess
  const error = searchParams?.get('error')

  // Check if user is already authenticated
  useEffect(() => {
    if (!autoRedirectIfAuthenticated) return

    const checkSession = async () => {
      try {
        const session = await getSession()
        if (session) {
          router.push(callbackUrl)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [router, callbackUrl, autoRedirectIfAuthenticated])

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await signIn('google', {
        callbackUrl,
        redirect: true,
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
      }
    } catch (error) {
      console.error('Error signing in:', error)
    }
    setIsLoading(false)
  }, [callbackUrl])

  useEffect(() => {
    if (error) router.replace(`/auth/error?error=${error}`)
  }, [error, router])

  return {
    isLoading,
    isCheckingSession,
    callbackUrl,
    handleGoogleSignIn,
  }
}
