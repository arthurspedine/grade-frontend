'use client'
import { MAX_SCORE } from '@/app/(home)/assessments/_helper/score'
import { GoBackButton } from '@/components/go-back-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEvaluation } from '@/context/evaluation-context'
import type { StudentEvaluationInfo } from '@/interfaces'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function EvaluateStudentContainer({
  initialData,
}: { initialData: StudentEvaluationInfo }) {
  const router = useRouter()

  const {
    evaluationData,
    updateCategoryScore,
    isEvaluationComplete,
    loadData,
  } = useEvaluation()
  const [activeTab, setActiveTab] = useState('1')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!evaluationData) {
      loadData(initialData)
    }
  }, [initialData, loadData, evaluationData])

  if (!evaluationData) {
    return <p className='text-center text-muted-foreground'>Carregando...</p>
  }

  function handleScoreChange(
    questionNumber: number,
    categoryIndex: number,
    value: number[]
  ) {
    updateCategoryScore(questionNumber, categoryIndex, value[0])
    setError(null)
  }

  function handleSubmit() {
    if (isEvaluationComplete()) {
      router.push(`/evaluate/student/${evaluationData?.student.id}/feedback`)
    } else {
      setError('Por favor, responda todas as questões antes de enviar.')
    }
  }

  function handleNextTab() {
    const currentTabNumber = Number.parseInt(activeTab)
    if (evaluationData?.questions) {
      if (currentTabNumber < evaluationData.questions.length) {
        setActiveTab((currentTabNumber + 1).toString())
      }
    }
  }

  function handlePrevTab() {
    const currentTabNumber = Number.parseInt(activeTab)
    if (currentTabNumber > 1) {
      setActiveTab((currentTabNumber - 1).toString())
    }
  }

  function isQuestionComplete(questionNumber: number): boolean {
    const question = evaluationData?.questions.find(
      q => q.questionNumber === questionNumber
    )
    if (!question) return false

    return question.categories.every(
      category =>
        typeof category.answeredScore === 'number' &&
        category.answeredScore >= 0
    )
  }

  return (
    <Card className='w-full px-8 py-6 hover:cursor-default'>
      <CardHeader className='flex-row justify-between space-y-0 px-0 py-2'>
        <div>
          <CardTitle className='hover:cursor-text'>
            Avaliando: {initialData.student.name}
          </CardTitle>
          <CardDescription className='hover:cursor-text'>
            <p>RM: {initialData.student.rm}</p>
            <p>
              Nota final:{' '}
              {Number(
                evaluationData.questions.reduce((total, question) => {
                  const questionScore = question.categories.reduce(
                    (sum, category) => sum + (category.answeredScore || 0),
                    0
                  )
                  return total + questionScore
                }, 0)
              ).toFixed(2)}{' '}
              / {MAX_SCORE}
            </p>
          </CardDescription>
        </div>
        <GoBackButton />
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          <TabsList className='mb-4 grid grid-cols-3 gap-2 lg:grid-cols-6'>
            {evaluationData.questions.map(question => {
              const questionNumber = question.questionNumber
              return (
                <TabsTrigger
                  key={questionNumber}
                  value={questionNumber.toString()}
                  className={
                    isQuestionComplete(questionNumber)
                      ? 'bg-green-500 text-foreground'
                      : ''
                  }
                >
                  Questão {questionNumber}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {evaluationData.questions.map(question => {
            const questionNumber = question.questionNumber
            return (
              <TabsContent
                key={questionNumber}
                value={questionNumber.toString()}
              >
                <h3 className='mb-2 font-medium text-lg hover:cursor-text'>
                  Questão {question.questionNumber}
                </h3>
                {question.categories.map((category, index) => (
                  <div
                    key={category.id}
                    className='border-border border-b-2 py-4 pb-2'
                  >
                    <div className='mb-2 flex justify-between'>
                      <p className='font-medium text-lg hover:cursor-text'>
                        {category.name}
                      </p>
                      <span className='font-medium hover:cursor-text'>
                        Pontuação esperada: {category.score}
                      </span>
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='flex-1'>
                        <Slider
                          value={[category.answeredScore || 0]}
                          max={category.score}
                          step={0.05}
                          onValueChange={value => {
                            handleScoreChange(
                              question.questionNumber,
                              index,
                              value
                            )
                          }}
                          className='hover:cursor-pointer'
                        />
                      </div>
                      <div className='w-12 text-center font-semibold hover:cursor-text'>
                        {category.answeredScore !== undefined
                          ? category.answeredScore
                          : 0}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            )
          })}
          {error && (
            <p className='pt-0.5 text-destructive text-sm hover:cursor-text'>
              {error}
            </p>
          )}
        </CardContent>
      </Tabs>
      <CardFooter className='mt-4 flex justify-between'>
        <Button
          variant={'outline'}
          onClick={handlePrevTab}
          disabled={activeTab === '1'}
        >
          <ChevronLeft /> Anterior
        </Button>

        <Button onClick={handleSubmit} variant={'green'}>
          Finalizar Avaliação
        </Button>

        <Button
          onClick={handleNextTab}
          disabled={
            Number.parseInt(activeTab) === evaluationData?.questions.length
          }
        >
          Próxima <ChevronRight />
        </Button>
      </CardFooter>
    </Card>
  )
}
