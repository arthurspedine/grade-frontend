import { SignInContent } from '@/components/auth/signin-content'

export default function SignInPage() {
  return (
    <div className='flex justify-center px-4 py-2 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <SignInContent
          redirectOnSuccess='/dashboard'
          autoRedirectIfAuthenticated={true}
          showTitle={true}
          title='Entre na sua conta'
          description='Faça login com sua conta Google.'
        />
      </div>
    </div>
  )
}
