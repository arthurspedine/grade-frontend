'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '../loading-spinner'
import { GoogleSignInButton } from './google-signin-button'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface SignInContentProps {
  redirectOnSuccess?: string
  autoRedirectIfAuthenticated?: boolean
  showTitle?: boolean
  title?: string
  description?: string
}

function SignInSearchParamsWrapper({
  redirectOnSuccess,
  autoRedirectIfAuthenticated,
}: { redirectOnSuccess: string; autoRedirectIfAuthenticated: boolean }) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl')
  const error = searchParams?.get('error')
  const { isLoading, isCheckingSession, handleGoogleSignIn } = useAuth({
    redirectOnSuccess,
    autoRedirectIfAuthenticated,
    callbackUrl,
    error,
  })

  if (isCheckingSession) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner />
      </div>
    )
  }
  return (
    <GoogleSignInButton
      isLoading={isLoading}
      disabled={isLoading}
      onClick={handleGoogleSignIn}
    />
  )
}

export function SignInContent({
  redirectOnSuccess = '/dashboard',
  autoRedirectIfAuthenticated = false,
  showTitle = true,
  title = 'Entre na sua conta',
  description = 'Faça login com sua conta Google.',
}: SignInContentProps) {
  return (
    <div className='space-y-6 w-full'>
      {showTitle && (
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold'>{title}</h2>
          <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
        </div>
      )}
      <Suspense>
        <SignInSearchParamsWrapper
          redirectOnSuccess={redirectOnSuccess}
          autoRedirectIfAuthenticated={autoRedirectIfAuthenticated}
        />
      </Suspense>
    </div>
  )
}
