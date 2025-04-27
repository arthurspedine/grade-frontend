'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

export function GoBackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <Button
      variant={'secondary'}
      className={cn('justify-end w-fit', className)}
      onClick={() => router.back()}
      type='button'
    >
      Voltar
    </Button>
  )
}
