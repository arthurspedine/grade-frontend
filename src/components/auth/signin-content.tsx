'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '../loading-spinner'
import { GoogleSignInButton } from './google-signin-button'

interface SignInContentProps {
  redirectOnSuccess?: string
  autoRedirectIfAuthenticated?: boolean
  showTitle?: boolean
  title?: string
  description?: string
}

export function SignInContent({
  redirectOnSuccess = '/dashboard',
  autoRedirectIfAuthenticated = false,
  showTitle = true,
  title = 'Entre na sua conta',
  description = 'Faça login com sua conta Google.',
}: SignInContentProps) {
  const { isLoading, isCheckingSession, handleGoogleSignIn } = useAuth({
    redirectOnSuccess,
    autoRedirectIfAuthenticated,
  })

  if (isCheckingSession) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className='space-y-6 w-full'>
      {showTitle && (
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold'>{title}</h2>
          <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
        </div>
      )}

      <GoogleSignInButton
        isLoading={isLoading}
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      />
    </div>
  )
}
