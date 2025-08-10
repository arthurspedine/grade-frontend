'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function GoBackButton({
  className,
  goBackUrl,
}: { className?: string; goBackUrl: string }) {
  const router = useRouter()

  const handleGoBack = () => {
    router.push(goBackUrl)
  }

  return (
    <Button
      variant='secondary'
      className={cn('w-fit justify-end', className)}
      onClick={handleGoBack}
      type='button'
    >
      Voltar
    </Button>
  )
}
