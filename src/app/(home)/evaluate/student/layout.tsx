import { EvaluationProvider } from '@/context/evaluation-context'

export default function EvaluateStudentLayout({
  children,
}: { children: React.ReactNode }) {
  return <EvaluationProvider>{children}</EvaluationProvider>
}
