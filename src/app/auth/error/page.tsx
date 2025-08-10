'use client'

import { LoadingSpinner } from '@/components/loading-spinner'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorMessage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Erro de configuração do servidor.'
      case 'AccessDenied':
        return 'Acesso negado. Você não tem permissão para acessar.'
      case 'Verification':
        return 'Token de verificação inválido ou expirado.'
      default:
        return 'Ocorreu um erro inesperado durante a autenticação.'
    }
  }

  return (
    <div className='mt-4 rounded-md border bg-secondary px-4 py-3 text-red-600'>
      <p className='text-center'>{getErrorMessage(error)}</p>
    </div>
  )
}

export default function AuthError() {
  return (
    <div className='flex justify-center px-4 py-2 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-center font-extrabold text-3xl'>
            Erro de Autenticação
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <ErrorMessage />
          </Suspense>
        </div>

        <div className='text-center'>
          <Link
            href='/auth/signin'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            Tentar novamente
          </Link>
        </div>
      </div>
    </div>
  )
}
