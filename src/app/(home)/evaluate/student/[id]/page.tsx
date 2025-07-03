import { isValid } from '@/helper/validate-uuid'
import type {
  StudentEvaluationInfo,
  StudentFinishedEvaluationInfo,
} from '@/interfaces'
import { redirect } from 'next/navigation'
import { handleGetStudentEvaluationInfo } from '../../_http/handle-http-evaluate'
import { EvaluateStudentContainer } from './_components/evaluate-student-container'
import { AlreadyEvaluatedStudentContainer } from './_components/already-evaluated-student-container'

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

  return studentEvaluationInfo.evaluationCompleted &&
    'answers' in studentEvaluationInfo ? (
    <AlreadyEvaluatedStudentContainer initialData={studentEvaluationInfo} />
  ) : 'questions' in studentEvaluationInfo ? (
    <EvaluateStudentContainer initialData={studentEvaluationInfo} />
  ) : (
    <p className='text-destructive text-center'>
      Unexpected error: invalid evaluation data.
    </p>
  )
}
