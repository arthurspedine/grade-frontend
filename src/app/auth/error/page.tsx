'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
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
    <div className='flex justify-center py-2 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold'>
            Erro de Autenticação
          </h2>
          <div className='mt-4 bg-secondary border text-red-600 px-4 py-3 rounded-md'>
            <p className='text-center'>{getErrorMessage(error)}</p>
          </div>
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
