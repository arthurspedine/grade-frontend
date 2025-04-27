'use client'
import { MAX_SCORE } from '@/app/assessments/_helper/score'
import {
  getChatFeedback,
  handleFinishEvaluation,
} from '@/app/evaluate/_http/handle-http-evaluate'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEvaluation } from '@/context/evaluation-context'
import { ChevronRight, CircleHelp, CornerDownRight } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function EvaluateFeedbackContainer({
  studentId,
}: { studentId: string }) {
  const router = useRouter()
  const { evaluationData, isEvaluationComplete, dataLoaded, updateFeedback } =
    useEvaluation()
  const [error, setError] = useState<string | null>(null)
  const [aiFeedback, setAiFeedback] = useState<string>('')
  const [isLoadingAiFeedback, setIsLoadingAiFeedback] = useState(false)

  useEffect(() => {
    if (!dataLoaded) {
      return
    }

    if (!evaluationData) {
      console.log(evaluationData)

      toast.error('Por favor, avalie um estudante antes de fazer o feedback.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      router.replace('/assessments')
      return
    }

    if (evaluationData.student.id !== studentId) {
      router.back()
    }
  }, [studentId, evaluationData, dataLoaded, router])

  useEffect(() => {
    if (!dataLoaded) {
      return
    }

    if (evaluationData && !isEvaluationComplete()) {
      toast.error(
        'Por favor, responda todas as categorias antes de fazer o feedback.',
        {
          position: 'top-center',
          style: { filter: 'none', zIndex: 10 },
        }
      )
      router.back()
    }
  }, [evaluationData, isEvaluationComplete, dataLoaded, router])

  if (!dataLoaded) {
    return <div>Carregando...</div>
  }

  if (!evaluationData) {
    return redirect('/assessments')
  }

  function handleFeedbackChange(value: string, field: 'raw' | 'final') {
    updateFeedback(value, field)
    setError(null)
  }

  async function handleGenerateAIFeedback() {
    if (!evaluationData?.rawFeedback) {
      setError(
        'O feedback inicial é obrigatório para gerar um feedback com IA.'
      )
      return
    }
    setIsLoadingAiFeedback(true)

    const { message } = await getChatFeedback(
      JSON.stringify(evaluationData?.questions),
      evaluationData?.rawFeedback
    )
    setAiFeedback(message)
    setIsLoadingAiFeedback(false)
  }

  function handleSubmit() {
    if (!evaluationData) return
    let error = ''
    if (!evaluationData?.rawFeedback) {
      error += 'O feedback inicial não pode ser nulo. '
    }
    if (!evaluationData?.finalFeedback) {
      error += 'O feedback final não pode ser nulo.'
    }
    if (error !== '') {
      setError(error)
      return
    }

    const handleRequest = handleFinishEvaluation(evaluationData)
    toast.promise(handleRequest, {
      loading: 'Finalizando avaliação...',
      success: () => {
        setTimeout(() => {
          redirect('/assessments')
        }, 500)
        return 'Avaliação finalizada com sucesso.'
      },
      error: 'Algo deu errado. Por favor, tente novamente mais tarde.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <Card selected className='hover:cursor-default px-8 py-6 w-full'>
      <CardHeader className='flex-row justify-between space-y-0 py-2 px-0'>
        <div>
          <CardTitle>Avaliando: {evaluationData.student.name}</CardTitle>
          <CardDescription>RM{evaluationData.student.rm}</CardDescription>
        </div>
        <div className='space-x-2'>
          <Button variant={'secondary'} onClick={() => router.back()}>
            Voltar
          </Button>
          <Button variant={'green'} onClick={handleSubmit}>
            Salvar Avaliação
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='border-border border-b-2 pb-2'>
          <div className='flex flex-row gap-4 w-full h-full'>
            <div className='flex flex-col gap-4 grow'>
              {/* RAW FEEDBACK */}
              <div className='space-y-1'>
                <label
                  className='text-base font-medium'
                  htmlFor='rawFeedback-id'
                >
                  Seu feedback
                </label>
                <Textarea
                  id='rawFeedback-id'
                  placeholder='Digite o seu feedback sobre a avaliação do estudante'
                  onChange={value =>
                    handleFeedbackChange(value.target.value, 'raw')
                  }
                  maxLength={1500}
                />
                <span className='flex text-muted-foreground text-sm justify-end'>
                  {evaluationData.rawFeedback
                    ? evaluationData.rawFeedback.length
                    : 0}
                  /1500
                </span>
              </div>
              <div className='space-y-2'>
                {/* AI FEEDBACK */}
                <div className='flex justify-between items-end'>
                  <label
                    className='text-base font-medium leading-none'
                    htmlFor='AIFeedback-id'
                  >
                    Feedback IA
                  </label>
                  <div className='flex items-center space-x-2'>
                    {aiFeedback && (
                      <Button
                        variant={'outline'}
                        onClick={() => updateFeedback(aiFeedback, 'final')}
                      >
                        <span className='mr-1'>Aplicar feedback</span>
                        <ChevronRight />
                      </Button>
                    )}
                    <Button
                      className='w-44'
                      disabled={isLoadingAiFeedback}
                      onClick={handleGenerateAIFeedback}
                    >
                      {isLoadingAiFeedback
                        ? 'Gerando...'
                        : 'Gerar feedback por IA'}
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type='button'>
                          <CircleHelp />
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                          <p>
                            A inteligência artificial usará o seu feedback
                            inicial
                          </p>
                          <p>
                            para estruturar o resultado final. Considere isso
                            como
                          </p>
                          <p>uma oportunidade para aprimorar a avaliação.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Textarea
                  id='AIFeedback-id'
                  placeholder='Clique no botão "Gerar feedback por IA" para receber um feedback gerado por uma LLM'
                  value={aiFeedback}
                  disabled={aiFeedback === ''}
                  readOnly
                  className='max-h-96 overflow-y-auto'
                  ref={textareaRef => {
                    if (textareaRef) {
                      textareaRef.style.height = 'auto'
                      textareaRef.style.height = `${Math.min(textareaRef.scrollHeight, 300)}px`
                    }
                  }}
                />
              </div>
            </div>
            {/* FINAL FEEDBACK */}
            <div className='flex flex-col grow space-y-1'>
              <label
                className='text-base font-medium flex justify-between'
                htmlFor='finalFeedback-id'
              >
                Feedback final
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type='button'>
                      <CircleHelp />
                    </TooltipTrigger>
                    <TooltipContent side='left'>
                      <p>O feedback final será de sua escolha entre</p>
                      <p>estruturar melhor o feedback ou fazer uma</p>
                      <p>união entre o feedback inicial com o da IA.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Textarea
                id='finalFeedback-id'
                placeholder='Digite aqui o feedback final da avaliação do estudante'
                className='flex-1'
                onChange={value =>
                  handleFeedbackChange(value.target.value, 'final')
                }
                value={evaluationData.finalFeedback || ''}
                maxLength={1500}
              />
              <span className='flex text-muted-foreground text-sm justify-end'>
                {evaluationData.finalFeedback
                  ? evaluationData.finalFeedback.length
                  : 0}
                /1500
              </span>
            </div>
          </div>
          {error && (
            <p className='text-destructive text-sm pt-2 text-center'>{error}</p>
          )}
        </div>

        <p className='mt-4'>
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
        {evaluationData.questions.map(question => (
          <div
            key={question.questionNumber}
            className='py-4 border-border border-b-2'
          >
            <p className='underline'>Questão N°{question.questionNumber}</p>

            {question.categories.map(category => (
              <div key={category.id} className='space-x-8'>
                <p className='flex'>
                  <CornerDownRight />
                  {category.name}
                </p>

                <span className='flex font-medium'>
                  <CornerDownRight />
                  Pontuação máxima: {category.score}
                </span>
                <span className='flex font-medium'>
                  <CornerDownRight />
                  Pontuação avaliada: {category.answeredScore}
                </span>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
