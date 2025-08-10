'use client'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GoogleIcon } from '../google-icon'

interface GoogleSignInButtonProps {
  isLoading: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function GoogleSignInButton({
  isLoading,
  onClick,
  disabled = false,
  className = '',
}: GoogleSignInButtonProps) {
  return (
    <Button
      type='button'
      onClick={onClick}
      disabled={isLoading || disabled}
      variant='secondary'
      className={cn(
        'group relative flex w-full justify-center rounded-md border border-transparent px-4 py-6 font-medium text-base disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-6',
        className
      )}
    >
      {isLoading ? <LoadingSpinner /> : <GoogleIcon />}
      {isLoading ? 'Entrando...' : 'Entrar com Google'}
    </Button>
  )
}
