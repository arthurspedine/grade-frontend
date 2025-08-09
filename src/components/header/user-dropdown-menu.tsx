'use client'

import { ChevronDown, LogOut } from 'lucide-react'
import type { DefaultSession } from 'next-auth'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { signOut } from 'next-auth/react'

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
        className='flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-secondary transition-colors duration-200 focus:outline-none'
      >
        {/* Avatar */}
        <Avatar className='size-8'>
          <AvatarImage src={user.image || ''} alt={`Foto de ${user.name}`} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <div className='flex items-center space-x-2 min-w-0'>
          <span className='text-sm font-medium text-primary truncate max-w-32'>
            {getFirstAndLastName(user.name)}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-secondary-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-fit bg-background rounded-lg shadow-lg border border-border pt-2 z-50 transition-all duration-200 transform origin-top-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* User info */}
        <div className='px-4 py-3 border-b border-border'>
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
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-primary text-nowrap'>
                {user.name}
              </p>
              <p className='text-xs text-muted-foreground'>{user.email}</p>
            </div>
          </div>
        </div>

        {/* options menu (maybe add new features in the future) */}

        {/* Logout */}
        <button
          type='button'
          onClick={() => signOut({ callbackUrl: '/' })}
          className='flex items-center w-full px-4 py-3 text-sm text-red-600'
        >
          <LogOut className='w-4 h-4 mr-3' />
          Sair
        </button>
      </div>
    </div>
  )
}
