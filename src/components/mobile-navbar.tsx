'use client'
import { pageLinks } from '@/helper/page-links'
import { BarChart3, GraduationCap, Home } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navIcons = {
  '/dashboard': Home,
  '/classes': GraduationCap,
  '/assessments': BarChart3,
}

export function MobileNavbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const user = session?.user

  if (isLoading) {
    return null
  }

  if (!isLoading && !user) {
    return null
  }

  return (
    <nav className='-bottom-1 fixed right-0 left-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 md:hidden'>
      <ul className='flex h-16 items-center justify-around px-2 pb-1'>
        {pageLinks.map(link => {
          const Icon = navIcons[link.path as keyof typeof navIcons]
          const isActive =
            pathname === link.path || pathname.startsWith(`${link.path}/`)

          return (
            <li key={link.name} className='flex-1'>
              <Link
                href={link.path}
                className={`flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {Icon && <Icon className='size-5' />}
                <span className='font-medium'>{link.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
