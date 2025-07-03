import { EvaluationProvider } from '@/context/evaluation-context'

export default function EvaluateStudentLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow max-h-screen'>
      <EvaluationProvider>{children}</EvaluationProvider>
    </section>
  )
}
