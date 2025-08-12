'use client'
import { MAX_SCORE } from '@/app/(home)/assessments/_helper/score'
import { EvaluationResultsViewer } from '@/components/evaluation-result-viewer'
import { GoBackButton } from '@/components/go-back-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEvaluation } from '@/context/evaluation-context'
import { isValid } from '@/helper/validate-uuid'
import {
  getChatFeedback,
  handleFinishEvaluation,
} from '@/http/handle-http-evaluate'
import {
  Award,
  Bot,
  CheckCircle,
  ChevronRight,
  CircleHelp,
  FileText,
  Hash,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  User,
} from 'lucide-react'
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
    return <p className='text-center text-muted-foreground'>Carregando...</p>
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
    setError(null)

    try {
      const { message } = await getChatFeedback(
        JSON.stringify(evaluationData?.questions),
        evaluationData?.rawFeedback
      )
      setAiFeedback(message)
    } catch (error) {
      setError('Erro ao gerar feedback com IA.')
      setAiFeedback(
        'Erro ao gerar o feedback com IA. Você pode tentar novamente ou continuar sem o feedback da IA.'
      )
    } finally {
      setIsLoadingAiFeedback(false)
    }
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
          router.replace(
            `/evaluate/${evaluationData.student.assessmentId}/${evaluationData.student.classId}`
          )
        }, 500)
        return 'Avaliação finalizada com sucesso.'
      },
      error: 'Algo deu errado. Por favor, tente novamente mais tarde.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <div className='container mx-auto max-w-6xl space-y-6'>
      {/* Header Card */}
      <Card>
        <CardHeader className='pb-4'>
          <div className='flex flex-col items-start justify-between gap-2 md:flex-row'>
            <div className='w-full space-y-1'>
              <CardTitle className='flex items-center gap-2 text-2xl'>
                <User className='size-6 text-primary' />
                Feedback Final: {evaluationData.student.name}
              </CardTitle>
              <CardDescription className='flex flex-col gap-1 text-base md:flex-row md:items-center md:gap-4'>
                <span className='flex items-center gap-1'>
                  <Hash className='h-4 w-4' />
                  RM: {evaluationData.student.rm}
                </span>
                <span className='flex items-center gap-1'>
                  <Award className='h-4 w-4' />
                  Nota Final:{' '}
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
                </span>
              </CardDescription>
            </div>
            <div className='flex w-full gap-2 md:w-fit'>
              <GoBackButton
                className='w-full justify-center md:w-fit'
                goBackUrl={`/evaluate/student/${evaluationData.student.id}`}
              />
              <Button
                variant='green'
                onClick={handleSubmit}
                className='w-full md:w-fit'
              >
                Salvar Avaliação
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Feedback Cards */}
      <Card className={error ? 'border border-destructive' : ''}>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MessageSquare className='size-5 text-primary' />
            Feedback da Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-border ${error && 'border-b-2'} flex h-full w-full flex-col gap-4 pb-2 sm:flex-row`}
          >
            {/* RAW AND AI FEEDBACK */}
            <div className='flex grow flex-col gap-4'>
              {/* RAW FEEDBACK */}
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <FileText className='size-4 text-blue-700 dark:text-blue-600' />
                  <label
                    className='font-medium text-base hover:cursor-text'
                    htmlFor='rawFeedback-id'
                  >
                    Seu Feedback Inicial
                  </label>
                </div>
                <Textarea
                  id='rawFeedback-id'
                  placeholder='Digite o seu feedback sobre a avaliação do estudante...'
                  onChange={value =>
                    handleFeedbackChange(value.target.value, 'raw')
                  }
                  maxLength={1500}
                  className='min-h-[120px]'
                />
                <span className='flex justify-end text-muted-foreground text-sm hover:cursor-text'>
                  {evaluationData.rawFeedback
                    ? evaluationData.rawFeedback.length
                    : 0}
                  /1500
                </span>
              </div>

              <div className='space-y-3'>
                {/* AI FEEDBACK */}
                <div className='flex flex-col justify-between gap-2 lg:flex-row lg:items-end'>
                  <div className='flex items-center gap-2'>
                    <Bot className='size-4 text-purple-700 dark:text-purple-600' />
                    <label
                      className='font-medium text-base leading-none hover:cursor-text'
                      htmlFor='AIFeedback-id'
                    >
                      Feedback Gerado por IA
                    </label>
                  </div>
                  <div className='flex flex-wrap items-center gap-2'>
                    {!aiFeedback && (
                      <Button
                        variant={'outline'}
                        onClick={() => updateFeedback(aiFeedback, 'final')}
                        className='flex items-center gap-2'
                      >
                        <CheckCircle className='h-4 w-4' />
                        <span>Aplicar feedback</span>
                        <ChevronRight className='h-4 w-4' />
                      </Button>
                    )}
                    <Button
                      variant={'purple'}
                      className='flex w-44 items-center gap-2'
                      disabled={isLoadingAiFeedback}
                      onClick={handleGenerateAIFeedback}
                    >
                      <Sparkles className='h-4 w-4' />
                      {isLoadingAiFeedback ? 'Gerando...' : 'Gerar feedback IA'}
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger type='button'>
                          <CircleHelp className='size-4 text-muted-foreground' />
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
                  placeholder='Clique no botão "Gerar feedback IA" para receber um feedback gerado automaticamente...'
                  value={aiFeedback}
                  disabled={aiFeedback === ''}
                  readOnly
                  className='max-h-96 min-h-[120px] overflow-y-auto border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20'
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
            <div className='flex grow flex-col space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <CheckCircle className='size-4 text-green-600' />
                  <label
                    className='font-medium text-base hover:cursor-text'
                    htmlFor='finalFeedback-id'
                  >
                    Feedback Final
                  </label>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type='button'>
                      <CircleHelp className='size-4 text-muted-foreground' />
                    </TooltipTrigger>
                    <TooltipContent side='left'>
                      <p>O feedback final será de sua escolha entre</p>
                      <p>estruturar melhor o feedback ou fazer uma</p>
                      <p>união entre o feedback inicial com o da IA.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id='finalFeedback-id'
                placeholder='Digite aqui o feedback final da avaliação do estudante...'
                className='min-h-[280px] flex-1 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
                onChange={value =>
                  handleFeedbackChange(value.target.value, 'final')
                }
                value={evaluationData.finalFeedback || ''}
                maxLength={1500}
              />
              <span className='flex justify-end text-muted-foreground text-sm'>
                {evaluationData.finalFeedback
                  ? evaluationData.finalFeedback.length
                  : 0}
                /1500
              </span>
            </div>
          </div>
          {error && (
            <p className='pt-2 text-center text-destructive text-sm hover:cursor-text'>
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Scores Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='size-5 text-primary' />
            Resumo das Notas Atribuídas
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {evaluationData.questions.map(question => {
            const questionTotal = question.categories.reduce(
              (sum, category) => sum + (category.answeredScore || 0),
              0
            )
            const questionMax = question.categories.reduce(
              (sum, category) => sum + category.score,
              0
            )
            const questionPercentage = (questionTotal / questionMax) * 100

            return (
              <div key={question.questionNumber} className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold text-lg'>
                    Questão {question.questionNumber}
                  </h3>
                  <div className='flex items-center gap-2 text-sm'>
                    <Target className='size-4 text-muted-foreground' />
                    <span className='font-medium'>
                      {questionTotal.toFixed(2)} / {questionMax} pontos
                    </span>
                  </div>
                </div>

                <Progress value={questionPercentage} className='h-2' />

                <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
                  {question.categories.map(category => (
                    <EvaluationResultsViewer
                      key={category.id}
                      {...category}
                      answeredScore={category.answeredScore || 0}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
