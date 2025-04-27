'use client'
import { MAX_SCORE } from '@/app/assessments/_helper/score'
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
    return <p className='text-muted-foreground text-center'>Carregando...</p>
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
    <Card selected className='hover:cursor-default px-8 py-6 w-full'>
      <CardHeader className='flex-row justify-between space-y-0 py-2 px-0'>
        <div>
          <CardTitle>Avaliando: {initialData.student.name}</CardTitle>
          <CardDescription>
            <p>RM{initialData.student.rm}</p>
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
        <Button variant={'secondary'} onClick={() => router.back()}>
          Voltar
        </Button>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          <TabsList className='grid grid-cols-3 lg:grid-cols-6 gap-2 mb-4'>
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
                <h3 className='text-lg font-medium mb-4'>
                  Questão {question.questionNumber}
                </h3>
                {question.categories.map((category, index) => (
                  <div
                    key={category.id}
                    className='border-b-2 border-border pb-2 py-4'
                  >
                    <div className='flex justify-between mb-2'>
                      <p className='font-medium text-lg'>{category.name}</p>
                      <span className='font-medium'>
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
                        />
                      </div>
                      <div className='w-12text-center font-semibold'>
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
          {error && <p className='text-destructive text-sm pt-0.5'>{error}</p>}
        </CardContent>
      </Tabs>
      <CardFooter className='flex justify-between mt-4'>
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
