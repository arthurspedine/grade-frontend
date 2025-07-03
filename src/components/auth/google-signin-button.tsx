'use client'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { GoogleIcon } from '../google-icon'
import { cn } from '@/lib/utils'

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
        'group relative w-full flex justify-center px-4 border border-transparent font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:size-6 py-6 text-base',
        className
      )}
    >
      {isLoading ? <LoadingSpinner /> : <GoogleIcon />}
      {isLoading ? 'Entrando...' : 'Entrar com Google'}
    </Button>
  )
}
