import { EvaluationProvider } from '@/context/evaluation-context'

export default function EvaluateStudentLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <section className='mx-auto max-h-screen w-full max-w-[1440px] flex-grow px-8'>
      <EvaluationProvider>{children}</EvaluationProvider>
    </section>
  )
}
