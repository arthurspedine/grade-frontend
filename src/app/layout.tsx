import './globals.css'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import type React from 'react'
import { Toaster } from 'sonner'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Grade App',
  description: 'Generate to manage college exam corrections',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute={'class'}
          defaultTheme={'system'}
          enableSystem
          disableTransitionOnChange
        >
          <main className='flex flex-col h-[calc(100dvh)] w-full scroll-smooth'>
            <UserProvider>
              <Header />
              {children}
              <Toaster theme='light' richColors />
            </UserProvider>
            {/* FOOTER */}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
