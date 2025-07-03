'use client'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import grade_logo_dark from '/public/grade_logo_dark.svg'
import grade_logo_light from '/public/grade_logo_light.svg'
import { Skeleton } from '../ui/skeleton'
import { ModeSwitcher } from '../theme-switcher'
import { useTheme } from 'next-themes'

export function Header() {
  const { data: session, status } = useSession()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const isLoading = status === 'loading'
  const user = session?.user

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    setMounted(true)
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
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

          <div className='relative inline-block text-left'>
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className='rounded-full hover:bg-transparent focus:border-none focus:outline-none font-medium text-sm text-center inline-flex items-center'
              type='button'
            >
              <Image
                src={user.image ? user.image : '/favicon.ico'}
                alt='Foto do usuario'
                width={42}
                height={42}
                className='rounded-full'
              />
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className='z-10 bg-muted divide-y divide-muted-foreground-50 rounded-lg shadow absolute right-0 animate-div-fade-in-down'
              >
                <div className='px-4 py-3 text-sm text-primary animate-fade-in-down'>
                  <p>{user.name}</p>
                  <p className='font-medium truncate'>{user.email}</p>
                </div>
                <div className='mt-2 animate-fade-in-down'>
                  <button
                    type='button'
                    onClick={() => signOut()}
                    className='block w-full text-left px-4 py-2 text-sm text-primary hover:border-b-2 hover:border-x-2 rounded-b-lg transition-all duration-300'
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
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
