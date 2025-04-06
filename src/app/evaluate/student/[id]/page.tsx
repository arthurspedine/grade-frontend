import { isValid } from '@/helper/validate-uuid'
import type {
  StudentEvaluationInfo,
  StudentFinishedEvaluationInfo,
} from '@/interfaces'
import { redirect } from 'next/navigation'
import { handleGetStudentEvaluationInfo } from '../../_http/handle-http-evaluate'

export default async function EvaluateInfoAssessmentPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isValid(id)) return redirect('/assessments')

  const studentEvaluationInfo:
    | StudentEvaluationInfo
    | StudentFinishedEvaluationInfo
    | null = await handleGetStudentEvaluationInfo(id)

  if (!studentEvaluationInfo) return redirect('/assessments')

  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow max-h-screen'>
      {studentEvaluationInfo.evaluationCompleted ? (
        // If student already evaluated
        <div>
          <p>ALREADY EVALUATED COMPONENT</p>
        </div>
      ) : (
        // Need to be evaluated
        <div>
          <p>NOT EVALUATED COMPONENT</p>
        </div>
      )}
    </section>
  )
}
