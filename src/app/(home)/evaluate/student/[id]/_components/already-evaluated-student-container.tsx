import { EvaluationResultsViewer } from '@/components/evaluation-result-viewer'
import { GoBackButton } from '@/components/go-back-button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { formatDate } from '@/helper/format-date'
import type { StudentFinishedEvaluationInfo } from '@/interfaces'
import {
  Award,
  Calendar,
  CheckCircle,
  FileText,
  Hash,
  MessageSquare,
  Target,
  TrendingUp,
  User,
} from 'lucide-react'
import { DownloadPdfButton } from './download-pdf-button'

export function AlreadyEvaluatedStudentContainer({
  initialData,
}: { initialData: StudentFinishedEvaluationInfo }) {
  const calculateTotalPercentage = () => {
    const maxPossibleScore = initialData.answers.reduce((total, question) => {
      return (
        total +
        question.categories.reduce((catTotal, cat) => catTotal + cat.score, 0)
      )
    }, 0)

    return (initialData.totalScore / maxPossibleScore) * 100
  }

  const totalPercentage = calculateTotalPercentage()

  return (
    <div className='container mx-auto max-w-4xl space-y-6'>
      {/* Header Card */}
      <div className='overflow-hidden rounded-lg bg-accent shadow-md'>
        <div className='border-b bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:from-green-900/20 dark:to-emerald-900/20'>
          <div className='w-full space-y-4'>
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-green-500 p-3'>
                  <CheckCircle className='size-6 text-white' />
                </div>
                <h2 className='font-semibold text-2xl'>Avaliação Finalizada</h2>
              </div>
              <div className='flex items-center gap-2'>
                <DownloadPdfButton id={String(initialData.student.id)} />
                <GoBackButton
                  goBackUrl={`/evaluate/${initialData.student.assessmentId}/${initialData.student.classId}`}
                />
              </div>
            </div>

            {/* Student Info */}
            <div className='flex flex-col gap-2 text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <div className='rounded-md bg-blue-100 p-1.5 dark:bg-blue-900/30'>
                  <User className='size-4 text-blue-600 dark:text-blue-400' />
                </div>
                <span className='font-semibold text-foreground text-lg'>
                  {initialData.student.name}
                </span>
              </div>
              <div className='ml-8 flex flex-col gap-1 text-sm sm:flex-row sm:gap-4'>
                <span className='flex items-center gap-1.5'>
                  <Hash className='size-4' />
                  RM: {initialData.student.rm}
                </span>
                <span className='flex items-center gap-1.5'>
                  <Calendar className='size-4' />
                  Avaliado em: {formatDate(initialData.finishedDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className='space-y-4 p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='rounded-md bg-yellow-100 p-2 dark:bg-yellow-900/30'>
                <Award className='size-5 text-yellow-600 dark:text-yellow-400' />
              </div>
              <span className='font-semibold text-lg'>Pontuação Final</span>
            </div>
            <div className='text-right'>
              <div className='font-bold text-2xl'>
                {initialData.totalScore.toFixed(2)}
              </div>
              <div className='text-muted-foreground text-sm'>
                {totalPercentage.toFixed(1)}%
              </div>
            </div>
          </div>
          <Progress value={totalPercentage} className='h-3' />
        </div>
      </div>

      {/* Detailed Scores Card */}
      <div className='overflow-hidden rounded-lg bg-accent shadow-md'>
        <div className='border-b p-6'>
          <h3 className='flex items-center gap-2 font-semibold text-xl'>
            <div className='rounded-md bg-purple-100 p-2 dark:bg-purple-900/30'>
              <TrendingUp className='size-5 text-purple-600 dark:text-purple-400' />
            </div>
            Detalhamento das Notas
          </h3>
        </div>
        <div className='p-6'>
          <Accordion type='multiple' className='w-full space-y-2'>
            {initialData.answers.map(question => {
              const questionTotal = question.categories.reduce(
                (sum, category) => sum + category.answeredScore,
                0
              )
              const questionMax = question.categories.reduce(
                (sum, category) => sum + category.score,
                0
              )
              const questionPercentage = (questionTotal / questionMax) * 100

              return (
                <AccordionItem
                  key={question.questionNumber}
                  value={`question-${question.questionNumber}`}
                  className='rounded-lg border bg-background px-4'
                >
                  <AccordionTrigger className='py-4 hover:no-underline'>
                    <div className='flex w-full flex-col justify-between gap-1 pr-2 sm:flex-row sm:items-center'>
                      <span className='font-semibold text-lg'>
                        Questão {question.questionNumber}
                      </span>
                      <div className='flex items-center justify-between gap-2 text-sm sm:justify-normal'>
                        <div className='flex items-center gap-1'>
                          <Target className='size-4 text-muted-foreground' />
                          <span className='font-medium'>
                            {questionTotal.toFixed(2)} / {questionMax} pontos
                          </span>
                        </div>
                        <span className='text-muted-foreground'>
                          ({questionPercentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pt-2 pb-4'>
                    <div className='space-y-3'>
                      <Progress value={questionPercentage} className='h-2' />
                      <div className='grid gap-3 md:grid-cols-2'>
                        {question.categories.map(category => (
                          <EvaluationResultsViewer
                            key={category.id}
                            {...category}
                          />
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>

      {/* Feedback Card */}
      <div className='overflow-hidden rounded-lg bg-accent shadow-md'>
        <div className='border-b p-6'>
          <h3 className='flex items-center gap-2 font-semibold text-xl'>
            <div className='rounded-md bg-blue-100 p-2 dark:bg-blue-900/30'>
              <MessageSquare className='size-5 text-blue-600 dark:text-blue-400' />
            </div>
            Feedback da Avaliação
          </h3>
        </div>
        <div className='space-y-6 p-6'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='rounded-full bg-blue-500 p-1.5'>
                <FileText className='size-4 text-white' />
              </div>
              <h4 className='font-semibold text-base'>Feedback Inicial</h4>
            </div>
            <div className='rounded-lg border bg-background p-4'>
              <p className='whitespace-pre-line text-foreground'>
                {initialData.rawFeedback}
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='rounded-full bg-green-500 p-1.5'>
                <CheckCircle className='size-4 text-white' />
              </div>
              <h4 className='font-semibold text-base'>Feedback Final</h4>
            </div>
            <div className='rounded-lg border bg-background p-4'>
              <p className='whitespace-pre-line text-foreground'>
                {initialData.finalFeedback}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
