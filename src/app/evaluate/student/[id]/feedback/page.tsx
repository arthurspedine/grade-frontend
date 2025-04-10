import { isValid } from '@/helper/validate-uuid'
import { redirect } from 'next/navigation'
import { EvaluateFeedbackContainer } from './_components/evaluate-feedback-container'

export default async function FeedbackPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isValid(id)) return redirect('/assessments')

  return <EvaluateFeedbackContainer studentId={id} />
}
