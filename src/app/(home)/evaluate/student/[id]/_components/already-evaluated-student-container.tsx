import { formatDate } from '@/helper/format-date'
import type { StudentFinishedEvaluationInfo } from '@/interfaces'
import {
  Award,
  Calendar,
  CheckCircle,
  FileText,
  User,
  CornerDownRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { GoBackButton } from '@/components/go-back-button'

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

    return Math.round((initialData.totalScore / maxPossibleScore) * 100)
  }

  const totalPercentage = calculateTotalPercentage()

  return (
    <Card className='shadow-md pb-6 px-10'>
      <CardHeader className='border-b px-0'>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle className='text-xl flex items-center gap-2'>
              <CheckCircle
                className='text-green-500 dark:text-green-400'
                size={24}
              />
              Avaliação Finalizada
            </CardTitle>
            <CardDescription className='flex flex-col mt-2'>
              <div className='flex items-center'>
                <User className='text-primary mr-2' size={24} />
                <h2 className='text-xl font-bold text-primary'>
                  {initialData.student.name}
                </h2>
              </div>
              <span className='text-muted-foreground text-base'>
                RM: {initialData.student.rm}
              </span>
            </CardDescription>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center gap-1 px-3 py-1 rounded-md border border-input bg-background shadow-sm hover:bg-accent/30 hover:text-accent-foreground'>
              Avaliado: <Calendar size={14} />
              {formatDate(initialData.finishedDate)}
            </div>
            <GoBackButton />
          </div>
        </div>

        <div className='mt-4'>
          <div className='flex justify-between items-center mb-2'>
            <div className='font-semibold flex items-center gap-2'>
              <Award size={18} />
              Pontuação total: {initialData.totalScore} pontos
            </div>
            <span className='text-sm text-muted-foreground'>
              {totalPercentage}%
            </span>
          </div>
          <Progress value={totalPercentage} className='h-2' />
        </div>
      </CardHeader>

      <CardContent>
        <Accordion type='multiple' className='w-full'>
          {initialData.answers.map(question => (
            <AccordionItem
              key={question.questionNumber}
              value={`question-${question.questionNumber}`}
            >
              <AccordionTrigger className='py-4 font-semibold'>
                Questão Nº {question.questionNumber}
              </AccordionTrigger>
              <AccordionContent>
                <div className='space-y-4 pl-2 pt-2'>
                  {question.categories.map(category => {
                    const categoryPercentage = Math.round(
                      (category.answeredScore / category.score) * 100
                    )
                    const scoreColor =
                      categoryPercentage >= 70
                        ? 'text-green-600 dark:text-green-500'
                        : categoryPercentage >= 50
                          ? 'text-amber-600 dark:text-amber-500'
                          : 'text-rose-600 dark:text-rose-500'

                    const progressBgClasses =
                      categoryPercentage >= 70
                        ? 'bg-emerald-100 dark:bg-emerald-950'
                        : categoryPercentage >= 50
                          ? 'bg-amber-100 dark:bg-amber-950'
                          : 'bg-rose-100 dark:bg-rose-950'

                    return (
                      <Card key={category.id} className='bg-accent/30'>
                        <CardContent className='py-1'>
                          <div className='font-bold dark:font-medium flex items-center gap-2 mb-2'>
                            <CornerDownRight size={16} />
                            {category.name}
                          </div>

                          <div className='pl-6 space-y-3'>
                            <div className='flex justify-between items-center text-sm'>
                              <span>Pontuação máxima: {category.score}</span>
                              <span
                                className={`font-bold dark:font-medium ${scoreColor}`}
                              >
                                Obtido: {category.answeredScore}
                              </span>
                            </div>

                            <Progress
                              value={categoryPercentage}
                              className={`h-1.5 ${progressBgClasses}`}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>

      <CardFooter className='flex flex-col items-start pt-6 border-t border-border'>
        <div className='w-full space-y-4'>
          <div className='flex items-center gap-2'>
            <FileText size={18} />
            <h2 className='text-lg font-semibold'>Feedback</h2>
          </div>

          <div className='space-y-4 pl-6'>
            <div>
              <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                Feedback Inicial:
              </h3>
              <p className='bg-accent/30 p-3 rounded-md whitespace-pre-line'>
                {initialData.rawFeedback}
              </p>
            </div>

            <div>
              <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                Feedback Final:
              </h3>
              <p className='bg-accent/30 p-3 rounded-md whitespace-pre-line'>
                {initialData.finalFeedback}
              </p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
