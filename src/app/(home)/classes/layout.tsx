export default function ClassesLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section className='mx-auto w-full max-w-[1440px] flex-grow px-6 pb-20 lg:pb-4'>
      {children}
    </section>
  )
}
