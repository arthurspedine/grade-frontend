'use client'
import { useUser } from '@auth0/nextjs-auth0/client'
import Image from 'next/image'
import grade_logo from '/public/grade_logo.svg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'

export function Header() {
  const { user, isLoading } = useUser()

  return (
    <header className='flex items-center justify-between pr-14 max-w-[1440px] mx-auto w-full'>
      <Link href={'/'}>
        <Image src={grade_logo} alt='Grade logo' className='w-36' />
      </Link>
      {isLoading && (
        <div className='flex items-center gap-4'>
          <ul className='flex space-x-4'>
            <Skeleton className='w-20 h-6' />
            <Skeleton className='w-20 h-6' />
          </ul>

          <Skeleton className='rounded-full w-12 h-12' />
        </div>
      )}
      {user && !isLoading && (
        <div className='flex items-center gap-4'>
          <ul className='flex space-x-4'>
            <li>
              <Link href={'/classes'} className='hover:underline'>
                Turmas
              </Link>
            </li>
            <li>Avaliações</li>
          </ul>

          <Image
            src={user.picture ? user.picture : ' '}
            alt='Foto do usuario'
            width={48}
            height={48}
            className='rounded-full'
          />
        </div>
      )}
      {!isLoading && !user && (
        <Button asChild>
          <Link href='/api/auth/login'>Entrar</Link>
        </Button>
      )}
    </header>
  )
}
