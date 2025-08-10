'use client'

import { ChevronDown, LogOut } from 'lucide-react'
import type { DefaultSession } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function UserDropdownMenu({
  user,
}: {
  user: {
    id?: string
  } & DefaultSession['user']
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function getInitials(name: string | null | undefined) {
    if (!name) {
      return ''
    }
    const nameParts = name.trim().split(' ')

    const firstNameInitial = nameParts[0][0].toUpperCase()
    const lastNameInitial =
      nameParts.length > 1
        ? nameParts[nameParts.length - 1][0].toUpperCase()
        : ''

    return firstNameInitial + lastNameInitial
  }

  function getFirstAndLastName(name: string | null | undefined) {
    if (!name) {
      return ''
    }
    const nameParts = name.trim().split(' ')

    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

    return `${firstName} ${lastName}`
  }

  return (
    <div className='relative mx-2' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-3 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-secondary focus:outline-none'
      >
        {/* Avatar */}
        <Avatar className='size-8'>
          <AvatarImage src={user.image || ''} alt={`Foto de ${user.name}`} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <div className='flex min-w-0 items-center space-x-2'>
          <span className='max-w-32 truncate font-medium text-primary text-sm'>
            {getFirstAndLastName(user.name)}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-secondary-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 z-50 mt-2 w-fit origin-top-right transform rounded-lg border border-border bg-background pt-2 shadow-lg transition-all duration-200 ${
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : '-translate-y-2 pointer-events-none scale-95 opacity-0'
        }`}
      >
        {/* User info */}
        <div className='border-border border-b px-4 py-3'>
          <div className='flex items-center space-x-3'>
            {/* Bigger Avatar */}
            <Avatar className='size-12'>
              <AvatarImage
                src={user.image || ''}
                alt={`Foto de ${user.name}`}
              />
              {/* <AvatarFallback>{getInitials(user.name)}</AvatarFallback> */}
              <AvatarFallback>SI</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className='min-w-0 flex-1'>
              <p className='text-nowrap font-semibold text-primary text-sm'>
                {user.name}
              </p>
              <p className='text-muted-foreground text-xs'>{user.email}</p>
            </div>
          </div>
        </div>

        {/* options menu (maybe add new features in the future) */}

        {/* Logout */}
        <button
          type='button'
          onClick={() => signOut({ callbackUrl: '/' })}
          className='flex w-full items-center px-4 py-3 text-red-600 text-sm'
        >
          <LogOut className='mr-3 h-4 w-4' />
          Sair
        </button>
      </div>
    </div>
  )
}
