import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import type React from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/auth-provider'

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
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body
        className={`${poppins.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute={'class'}
          defaultTheme={'system'}
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <main className='flex flex-col h-[calc(100dvh)] w-full scroll-smooth'>
              {children}
              <Toaster richColors />
            </main>
            {modal}
            <div id='modal-root' />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
