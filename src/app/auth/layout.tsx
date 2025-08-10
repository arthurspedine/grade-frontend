'use client'
import { ModeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import grade_logo_dark from '/public/grade_logo_dark.svg'
import grade_logo_light from '/public/grade_logo_light.svg'

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
      <header className='mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-4'>
        <Link href={'/'}>
          {mounted ? (
            <Image src={logoSrc} alt='Grade logo' className='w-12' />
          ) : (
            <Skeleton className='h-14 w-12' />
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
