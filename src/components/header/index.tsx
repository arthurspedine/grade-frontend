'use client'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import grade_logo_dark from '/public/grade_logo_dark.svg'
import grade_logo_light from '/public/grade_logo_light.svg'
import { Skeleton } from '../ui/skeleton'
import { ModeSwitcher } from '../theme-switcher'
import { useTheme } from 'next-themes'
import { UserDropdownMenu } from './user-dropdown-menu'

export function Header() {
  const { data: session, status } = useSession()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const isLoading = status === 'loading'
  const user = session?.user
  console.log(user)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc =
    mounted && resolvedTheme === 'dark' ? grade_logo_dark : grade_logo_light

  return (
    <header className='flex items-center justify-between px-6 py-4 max-w-[1440px] mx-auto w-full'>
      <Link href={'/'}>
        {mounted ? (
          <Image src={logoSrc} alt='Grade logo' className='w-12' />
        ) : (
          <Skeleton className='w-12 h-14' />
        )}
      </Link>
      {isLoading && (
        <div className='flex items-center gap-4'>
          <ul className='flex space-x-4'>
            <Skeleton className='w-20 h-6' />
            <Skeleton className='w-20 h-6' />
            <Skeleton className='w-20 h-6' />
          </ul>

          <Skeleton className='rounded-full w-12 h-12' />
          <Skeleton className='size-8' />
        </div>
      )}
      {user && !isLoading && (
        <div className='flex items-center gap-4'>
          <ul className='flex space-x-4'>
            <li>
              <Link href={'/dashboard'} className='group relative'>
                Dashboard
                <span className='absolute h-0.5 bg-current left-0 -bottom-0.5 w-0 group-hover:w-full transition-all duration-300' />
              </Link>
            </li>
            <li>
              <Link href={'/classes'} className='group relative'>
                Turmas
                <span className='absolute h-0.5 bg-current left-0 -bottom-0.5 w-0 group-hover:w-full transition-all duration-300' />
              </Link>
            </li>
            <li>
              <Link href={'/assessments'} className='group relative'>
                Avaliações
                <span className='absolute h-0.5 bg-current left-0 -bottom-0.5 w-0 group-hover:w-full transition-all duration-300' />
              </Link>
            </li>
          </ul>

          <UserDropdownMenu user={user} />

          <ModeSwitcher />
        </div>
      )}
      {!isLoading && !user && (
        <div className='flex items-center space-x-2'>
          <Button asChild variant={'secondary'}>
            <Link href='/auth/signin'>Entrar</Link>
          </Button>
          <ModeSwitcher />
        </div>
      )}
    </header>
  )
}
