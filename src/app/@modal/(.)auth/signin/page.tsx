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
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
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
