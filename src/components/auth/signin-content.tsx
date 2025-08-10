'use client'

import { useAuth } from '@/hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { LoadingSpinner } from '../loading-spinner'
import { GoogleSignInButton } from './google-signin-button'

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
      <div className='flex items-center justify-center py-8'>
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
    <div className='w-full space-y-6'>
      {showTitle && (
        <div className='text-center'>
          <h2 className='font-extrabold text-3xl'>{title}</h2>
          <p className='mt-2 text-muted-foreground text-sm'>{description}</p>
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
