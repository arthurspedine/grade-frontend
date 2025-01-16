'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@auth0/nextjs-auth0/client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import grade_logo from '/public/grade_logo.svg'
import { Skeleton } from '../ui/skeleton'

export function Header() {
  const { user, isLoading } = useUser()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
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
            <li>
              <Link href={'/assessments'} className='hover:underline'>
                Avaliações
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
                src={user.picture ? user.picture : ' '}
                alt='Foto do usuario'
                width={48}
                height={48}
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
                  <a
                    href='/api/auth/logout'
                    className='block px-4 py-2 text-sm text-primary hover:border-b-2 hover:border-x-2 rounded-b-lg transition-all duration-300'
                  >
                    Sair
                  </a>
                </div>
              </div>
            )}
          </div>
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
