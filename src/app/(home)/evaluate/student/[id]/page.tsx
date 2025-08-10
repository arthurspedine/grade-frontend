import { isValid } from '@/helper/validate-uuid'
import { handleGetStudentEvaluationInfo } from '@/http/handle-http-evaluate'
import type {
  StudentEvaluationInfo,
  StudentFinishedEvaluationInfo,
} from '@/interfaces'
import { redirect } from 'next/navigation'
import { AlreadyEvaluatedStudentContainer } from './_components/already-evaluated-student-container'
import { EvaluateStudentContainer } from './_components/evaluate-student-container'

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
    <p className='text-center text-destructive'>
      Unexpected error: invalid evaluation data.
    </p>
  )
}
