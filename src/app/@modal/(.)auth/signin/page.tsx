'use client'
import { SignInContent } from '@/components/auth/signin-content'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true,
      })
    } catch (error) {
      console.error('Error signing in:', error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog defaultOpen={true} onOpenChange={() => router.back()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>
            Entre na sua conta
          </DialogTitle>
          <DialogDescription className='text-center'>
            Faça login com sua conta Google.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <SignInContent
            autoRedirectIfAuthenticated={false}
            showTitle={false}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
