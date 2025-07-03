'use client'
import { useEffect, useState } from 'react'
import grade_logo_dark from '/public/grade_logo_dark.svg'
import grade_logo_light from '/public/grade_logo_light.svg'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { ModeSwitcher } from '@/components/theme-switcher'

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc =
    mounted && resolvedTheme === 'dark' ? grade_logo_dark : grade_logo_light
  return (
    <>
      <header className='flex items-center justify-between px-6 py-4 max-w-[1440px] mx-auto w-full'>
        <Link href={'/'}>
          {mounted ? (
            <Image src={logoSrc} alt='Grade logo' className='w-12' />
          ) : (
            <Skeleton className='w-12 h-14' />
          )}
        </Link>
        <div className='flex items-center space-x-2'>
          <Button asChild variant={'secondary'}>
            <Link href='/'>Voltar</Link>
          </Button>
          <ModeSwitcher />
        </div>
      </header>
      {children}
    </>
  )
}
