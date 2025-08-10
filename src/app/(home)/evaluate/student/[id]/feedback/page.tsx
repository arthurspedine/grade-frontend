'use client'
import { MAX_SCORE } from '@/app/(home)/assessments/_helper/score'
import {
  getChatFeedback,
  handleFinishEvaluation,
} from '@/http/handle-http-evaluate'
import { GoBackButton } from '@/components/go-back-button'
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
import { isValid } from '@/helper/validate-uuid'
import { ChevronRight, CircleHelp, CornerDownRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function FeedbackPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  if (!params || !isValid(params.id)) return router.replace('/assessments')

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
      toast.error('Por favor, avalie um estudante antes de fazer o feedback.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      router.replace('/assessments')
      return
    }

    if (evaluationData.student.id !== params.id) {
      router.back()
    }
  }, [params, evaluationData, dataLoaded, router])

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
    return <p className='text-muted-foreground text-center'>Carregando...</p>
  }

  if (!evaluationData) {
    return router.replace('/assessments')
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
      error += 'O feedback inicial é obrigatório. '
    }
    if (!evaluationData?.finalFeedback) {
      error += 'O feedback final é obrigatório.'
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
          router.replace('/assessments')
        }, 500)
        return 'Avaliação finalizada com sucesso.'
      },
      error: 'Algo deu errado. Por favor, tente novamente mais tarde.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <Card className='hover:cursor-default px-8 py-12 w-full'>
      <CardHeader className='flex-row justify-between space-y-0 py-2 px-0'>
        <div>
          <CardTitle className='hover:cursor-text'>
            Avaliando: {evaluationData.student.name}
          </CardTitle>
          <CardDescription className='hover:cursor-text'>
            RM: {evaluationData.student.rm}
          </CardDescription>
        </div>
        <div className='space-x-2'>
          <GoBackButton />
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
                  className='text-base font-medium hover:cursor-text'
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
                <span className='flex text-muted-foreground text-sm justify-end hover:cursor-text'>
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
                    className='text-base font-medium leading-none hover:cursor-text'
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
                      variant={'blue'}
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
                      textareaRef.style.height = `${Math.min(textareaRef.scrollHeight + 10, 300)}px`
                    }
                  }}
                />
              </div>
            </div>
            {/* FINAL FEEDBACK */}
            <div className='flex flex-col grow space-y-1'>
              <label
                className='text-base font-medium flex justify-between hover:cursor-text'
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
            <p className='text-destructive text-sm pt-2 text-center hover:cursor-text'>
              {error}
            </p>
          )}
        </div>

        <p className='mt-4 hover:cursor-text'>
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
            <p className='underline hover:cursor-text'>
              Questão N°{question.questionNumber}
            </p>

            {question.categories.map(category => (
              <div key={category.id} className='space-x-8 hover:cursor-text'>
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
