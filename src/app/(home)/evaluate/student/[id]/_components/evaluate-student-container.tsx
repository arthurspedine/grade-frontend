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
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { useEvaluation } from '@/context/evaluation-context'
import type { StudentEvaluationInfo } from '@/interfaces'
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
  Hash,
  Minus,
  Plus,
  User,
} from 'lucide-react'
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!evaluationData) {
      loadData(initialData)
    }
  }, [initialData, loadData, evaluationData])

  if (!evaluationData) {
    return <p className='text-center text-muted-foreground'>Carregando...</p>
  }

  const currentQuestion = evaluationData.questions[currentQuestionIndex]
  const totalQuestions = evaluationData.questions.length
  const completedQuestions = evaluationData.questions.filter(q =>
    q.categories.every(
      cat => typeof cat.answeredScore === 'number' && cat.answeredScore >= 0
    )
  ).length

  function handleScoreChange(
    questionNumber: number,
    categoryIndex: number,
    value: number
  ) {
    updateCategoryScore(questionNumber, categoryIndex, value)
    setError(null)
  }

  function handleSubmit() {
    if (isEvaluationComplete()) {
      router.push(`/evaluate/student/${evaluationData?.student.id}/feedback`)
    } else {
      setError('Por favor, responda todas as questões antes de enviar.')
    }
  }

  function goToNext() {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setError(null)
    }
  }

  function goToPrev() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setError(null)
    }
  }

  function isQuestionComplete(questionIndex: number): boolean {
    const question = evaluationData?.questions[questionIndex]
    if (!question) return false

    return question.categories.every(
      category =>
        typeof category.answeredScore === 'number' &&
        category.answeredScore >= 0
    )
  }

  const totalScore = evaluationData.questions.reduce((total, question) => {
    const questionScore = question.categories.reduce(
      (sum, category) => sum + (category.answeredScore || 0),
      0
    )
    return total + questionScore
  }, 0)

  const progressPercentage = (completedQuestions / totalQuestions) * 100

  return (
    <div className='container mx-auto max-w-4xl space-y-6'>
      {/* Header com informações do aluno */}
      <Card>
        <CardHeader className='pb-4'>
          <div className='w-full space-y-1'>
            <CardTitle className='flex w-full justify-between text-2xl'>
              <div className='flex items-start gap-2'>
                <User className='size-6 text-primary' />
                {initialData.student.name}
              </div>
              <GoBackButton
                goBackUrl={`/evaluate/${initialData.student.assessmentId}/${evaluationData.student.classId}`}
              />
            </CardTitle>
            <CardDescription className='flex flex-col gap-1 text-base sm:flex-row sm:items-center sm:gap-4'>
              <span className='flex items-center gap-1'>
                <Hash className='h-4 w-4' />
                RM: {initialData.student.rm}
              </span>
              <span className='flex items-center gap-1'>
                <Award className='h-4 w-4' />
                Nota: {totalScore.toFixed(2)} / {MAX_SCORE}
              </span>
            </CardDescription>
          </div>

          {/* Progress indicator */}
          <div className='space-y-2 pt-2'>
            <div className='flex justify-between text-sm'>
              <span>Progresso da Avaliação</span>
              <span>
                {completedQuestions} de {totalQuestions} questões
              </span>
            </div>
            <Progress value={progressPercentage} className='h-2' />
          </div>
        </CardHeader>
      </Card>

      {/* Navegação entre questões */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>
              Questão {currentQuestion.questionNumber} de {totalQuestions}
            </CardTitle>
            <div className='flex gap-2'>
              {evaluationData.questions.map((question, index) => (
                <button
                  key={question.questionNumber}
                  type='button'
                  onClick={() => {
                    setCurrentQuestionIndex(index)
                    setError(null)
                  }}
                  className={`flex size-8 items-center justify-center rounded-full font-medium text-xs transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-primary-foreground'
                      : isQuestionComplete(index)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {isQuestionComplete(index) ? (
                    <CheckCircle2 className='h-4 w-4' />
                  ) : (
                    index + 1
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          {currentQuestion.categories.map((category, categoryIndex) => (
            <Card key={category.id} className='border-l-4 border-l-primary/30'>
              <CardContent className='p-4'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-semibold text-lg'>{category.name}</h4>
                    <span className='text-muted-foreground text-sm'>
                      Máximo: {category.score} pontos
                    </span>
                  </div>

                  <div className='space-y-4'>
                    {/* Controles de pontuação */}
                    <div className='space-y-3'>
                      <div className='flex flex-col items-center justify-between sm:flex-row'>
                        <span className='font-medium text-sm'>Pontuação:</span>
                        <div className='flex items-center gap-1'>
                          {/* Botões de diminuir */}
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const currentScore = category.answeredScore || 0
                              const newScore = Math.max(0, currentScore - 1)
                              handleScoreChange(
                                currentQuestion.questionNumber,
                                categoryIndex,
                                newScore
                              )
                            }}
                            disabled={(category.answeredScore || 0) < 1}
                            className='hidden size-8 p-0 sm:flex'
                            title='Diminuir 1 ponto'
                          >
                            <ChevronsLeft className='size-3' />
                          </Button>

                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const currentScore = category.answeredScore || 0
                              const newScore = Math.max(0, currentScore - 0.5)
                              handleScoreChange(
                                currentQuestion.questionNumber,
                                categoryIndex,
                                newScore
                              )
                            }}
                            disabled={(category.answeredScore || 0) < 0.5}
                            className='size-8 p-0'
                            title='Diminuir 0.5 pontos'
                          >
                            <ChevronLeft className='size-3' />
                          </Button>

                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const currentScore = category.answeredScore || 0
                              const newScore = Math.max(0, currentScore - 0.25)
                              handleScoreChange(
                                currentQuestion.questionNumber,
                                categoryIndex,
                                newScore
                              )
                            }}
                            disabled={(category.answeredScore || 0) < 0.25}
                            className='size-8 p-0'
                            title='Diminuir 0.25 pontos'
                          >
                            <Minus className='size-3' />
                          </Button>

                          {/* Display da nota */}
                          <div className='mx-2 flex min-w-[80px] items-center justify-center rounded-md border bg-background px-3 py-1'>
                            <span className='font-medium text-sm'>
                              {(category.answeredScore || 0).toFixed(2)}
                            </span>
                          </div>

                          {/* Botões de aumentar */}
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const currentScore = category.answeredScore || 0
                              const newScore = Math.min(
                                category.score,
                                currentScore + 0.25
                              )
                              handleScoreChange(
                                currentQuestion.questionNumber,
                                categoryIndex,
                                newScore
                              )
                            }}
                            disabled={
                              (category.answeredScore || 0) >= category.score
                            }
                            className='size-8 p-0'
                            title='Aumentar 0.25 pontos'
                          >
                            <Plus className='size-3' />
                          </Button>

                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const currentScore = category.answeredScore || 0
                              const newScore = Math.min(
                                category.score,
                                currentScore + 0.5
                              )
                              handleScoreChange(
                                currentQuestion.questionNumber,
                                categoryIndex,
                                newScore
                              )
                            }}
                            disabled={
                              (category.answeredScore || 0) >= category.score
                            }
                            className='size-8 p-0'
                            title='Aumentar 0.5 pontos'
                          >
                            <ChevronRight className='size-3' />
                          </Button>

                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              const currentScore = category.answeredScore || 0
                              const newScore = Math.min(
                                category.score,
                                currentScore + 1
                              )
                              handleScoreChange(
                                currentQuestion.questionNumber,
                                categoryIndex,
                                newScore
                              )
                            }}
                            disabled={
                              (category.answeredScore || 0) >= category.score
                            }
                            className='hidden size-8 p-0 sm:flex'
                            title='Aumentar 1 ponto'
                          >
                            <ChevronsRight className='size-3' />
                          </Button>
                        </div>
                      </div>

                      {/* Slider para ajuste fino */}
                      <div className='space-y-2'>
                        <span className='font-medium text-sm'>
                          Ajuste fino:
                        </span>
                        <div className='flex items-center gap-3'>
                          <span className='text-sm'>0</span>
                          <Slider
                            value={[category.answeredScore || 0]}
                            max={category.score}
                            step={0.5}
                            onValueChange={value =>
                              handleScoreChange(
                                currentQuestion.questionNumber,
                                categoryIndex,
                                value[0]
                              )
                            }
                            className='flex-1'
                          />
                          <span className='text-sm'>{category.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display da nota atual */}
                  <div className='flex items-center gap-2 rounded-md bg-muted/50 p-2'>
                    <Circle
                      className={`size-3 sm:size-4 ${
                        typeof category.answeredScore === 'number' &&
                        category.answeredScore >= 0
                          ? 'fill-green-500 text-green-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <span className='text-xs sm:text-sm'>
                      Nota atribuída:{' '}
                      <strong>
                        {category.answeredScore?.toFixed(2) || '0.00'}
                      </strong>{' '}
                      pontos
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {error && (
            <div className='rounded-md border border-destructive/20 bg-destructive/10 p-3'>
              <p className='text-destructive text-sm'>{error}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className='flex justify-between pt-6'>
          <Button
            variant='outline'
            onClick={goToPrev}
            disabled={currentQuestionIndex === 0}
            className='flex items-center gap-2'
          >
            <ChevronLeft className='h-4 w-4' />
            Anterior
          </Button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button onClick={handleSubmit} variant='green'>
              Finalizar Avaliação
            </Button>
          ) : (
            <Button
              onClick={goToNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className='flex items-center gap-2'
            >
              Próxima
              <ChevronRight className='h-4 w-4' />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
