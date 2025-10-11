import { EvaluationResultsViewer } from '@/components/evaluation-result-viewer'
import { GoBackButton } from '@/components/go-back-button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
      <Card>
        <CardHeader className='pb-4'>
          <div className='w-full space-y-1'>
            <CardTitle className='flex items-start justify-between text-2xl sm:items-center'>
              <h2 className='flex items-center gap-2'>
                <CheckCircle className='size-6 text-green-600 dark:text-green-400' />
                Avaliação Finalizada
              </h2>
              <div className='flex flex-col-reverse items-end gap-2 sm:flex-row sm:items-center'>
                <DownloadPdfButton id={initialData.student.id} />
                <GoBackButton
                  goBackUrl={`/evaluate/${initialData.student.assessmentId}/${initialData.student.classId}`}
                />
              </div>
            </CardTitle>
            <CardDescription className='flex flex-col gap-1'>
              <div className='flex items-center gap-2 text-lg'>
                <User className='size-5 text-primary' />
                <span className='text-nowrap font-semibold text-foreground'>
                  {initialData.student.name}
                </span>
              </div>
              <div className='flex flex-col text-base sm:flex-row sm:items-center sm:gap-4'>
                <span className='flex items-center gap-1 text-nowrap'>
                  <Hash className='h-4 w-4' />
                  RM: {initialData.student.rm}
                </span>
                <span className='flex items-center gap-1 text-nowrap'>
                  <Calendar className='h-4 w-4' />
                  Avaliado em: {formatDate(initialData.finishedDate)}
                </span>
              </div>
            </CardDescription>
          </div>

          {/* Score Summary */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Award className='size-5 text-primary' />
                <span className='font-semibold text-lg'>
                  Pontuação Final: {initialData.totalScore.toFixed(2)}
                </span>
              </div>
              <span className='font-medium text-muted-foreground'>
                {totalPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={totalPercentage} className='h-3' />
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Scores Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='size-5 text-primary' />
            Detalhamento das Notas
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                  className='rounded-lg border px-4'
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
        </CardContent>
      </Card>

      {/* Feedback Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MessageSquare className='size-5 text-primary' />
            Feedback da Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <FileText className='size-4 text-blue-600 dark:text-blue-400' />
              <h3 className='font-semibold text-base'>Feedback Inicial</h3>
            </div>
            <div className='rounded-lg border bg-muted/30 p-4'>
              <p className='whitespace-pre-line text-foreground'>
                {initialData.rawFeedback}
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='size-4 text-green-600 dark:text-green-400' />
              <h3 className='font-semibold text-base'>Feedback Final</h3>
            </div>
            <div className='rounded-lg border bg-muted/30 p-4'>
              <p className='whitespace-pre-line text-foreground'>
                {initialData.finalFeedback}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
