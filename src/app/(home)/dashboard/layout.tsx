import { Title } from '@/components/title'

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section className='mx-auto flex w-full max-w-[1440px] flex-grow flex-col px-6 pb-20 lg:px-8 lg:pb-4'>
      <Title>Dashboard</Title>
      {children}
    </section>
  )
}
