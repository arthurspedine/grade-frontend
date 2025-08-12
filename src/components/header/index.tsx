'use client'
import { Button } from '@/components/ui/button'
import { pageLinks } from '@/helper/page-links'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import grade_logo_dark from '/public/grade_logo_dark.svg'
import grade_logo_light from '/public/grade_logo_light.svg'
import { ModeSwitcher } from '../theme-switcher'
import { Skeleton } from '../ui/skeleton'
import { UserDropdownMenu } from './user-dropdown-menu'

export function Header() {
  const { data: session, status } = useSession()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const isLoading = status === 'loading'
  const user = session?.user

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc =
    mounted && resolvedTheme === 'dark' ? grade_logo_dark : grade_logo_light

  return (
    <header className='mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4'>
      <Link href={'/'}>
        {mounted ? (
          <Image src={logoSrc} alt='Grade logo' className='w-12' />
        ) : (
          <Skeleton className='h-14 w-12' />
        )}
      </Link>
      {isLoading && (
        <div className='flex items-center gap-4'>
          <ul className='hidden space-x-4 md:flex'>
            <Skeleton className='h-6 w-20' />
            <Skeleton className='h-6 w-20' />
            <Skeleton className='h-6 w-20' />
          </ul>

          <Skeleton className='size-10 rounded-full md:h-12 md:w-48 md:rounded-md' />
          <Skeleton className='size-8' />
        </div>
      )}
      {user && !isLoading && (
        <div className='flex items-center gap-2'>
          <ul className='hidden space-x-4 md:flex'>
            {pageLinks.map(link => (
              <li key={link.name}>
                <Link href={link.path} className='group relative'>
                  {link.name}
                  <span className='-bottom-0.5 absolute left-0 h-0.5 w-0 bg-current transition-all duration-300 group-hover:w-full' />
                </Link>
              </li>
            ))}
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
