import { Header } from '@/components/header'
import { MobileNavbar } from '@/components/mobile-navbar'

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <MobileNavbar />
    </>
  )
}
