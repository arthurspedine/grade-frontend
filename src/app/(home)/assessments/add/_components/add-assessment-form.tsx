'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { addAssessment } from '@/http/handle-http-assessments'
import {
  type AddAssessmentFormType,
  type QuestionCategoryType,
  addAssessmentFormSchema,
} from '@/schemas'
import type { ClassType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { MAX_SCORE } from '../../_helper/score'
import {
  validateDuplicateCategoryName,
  validateNewScore,
} from '../shared-validation'
import { AddCategoryDialog } from './add-category-dialog'
import { EditCategoryItem } from './edit-category-item'

export function AddAssessmentForm({ classList }: { classList: ClassType[] }) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
    control,
  } = useForm<AddAssessmentFormType>({
    resolver: zodResolver(addAssessmentFormSchema),
    defaultValues: {
      classes: [],
      questions: [],
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: 'questions',
  })

  const [selectedClasses, setSelectedClasses] = useState<ClassType[]>([])

  useEffect(() => {
    setValue(
      'classes',
      selectedClasses.map(c => ({ id: c.id }))
    )
    clearErrors('classes')
  }, [selectedClasses, setValue, clearErrors])

  function handleAddCategoryToList(
    newCategory: QuestionCategoryType,
    currentQuestionIndex: number
  ) {
    const updatedCategories = [
      ...getValues(`questions.${currentQuestionIndex}.categories`),
      newCategory,
    ]

    setValue(`questions.${currentQuestionIndex}.categories`, updatedCategories)
    clearErrors(`questions.${currentQuestionIndex}.categories`)
    clearErrors('questions')
    toast.success('Categoria adicionada com sucesso.', {
      style: { filter: 'none', zIndex: 10 },
      position: 'top-center',
    })
  }

  function getCurrentScore(): number {
    return getValues('questions').reduce(
      (sum, question) =>
        sum +
        question.categories.reduce(
          (catSum, category) => catSum + category.score,
          0
        ),
      0
    )
  }

  function handleRemoveCategoryFromList(
    questionIndex: number,
    categoryIndex: number
  ) {
    const updatedCategories = [
      ...getValues(`questions.${questionIndex}.categories`),
    ]

    updatedCategories.splice(categoryIndex, 1)
    setValue(`questions.${questionIndex}.categories`, updatedCategories)
    toast.success('Categoria removida com sucesso.', {
      style: { filter: 'none', zIndex: 10 },
      position: 'top-center',
    })
  }

  function handleEditCategoryItem(
    category: QuestionCategoryType,
    categoryIndex: number,
    questionIndex: number
  ): boolean {
    const currentCategories = [
      ...getValues(`questions.${questionIndex}.categories`),
    ]

    const oldCategory = currentCategories[categoryIndex]

    const newScore = getCurrentScore() + category.score - oldCategory.score

    if (!validateNewScore(newScore)) return true

    if (
      category.name.toLocaleLowerCase() !== oldCategory.name.toLocaleLowerCase()
    ) {
      if (validateDuplicateCategoryName(category.name, getValues('questions')))
        return true
    }

    currentCategories[categoryIndex] = {
      ...currentCategories[categoryIndex],
      name: category.name,
      score: category.score,
    }
    setValue(`questions.${questionIndex}.categories`, currentCategories)
    clearErrors('questions')
    toast.success('Categoria editada com sucesso.', {
      style: { filter: 'none', zIndex: 10 },
      position: 'top-center',
    })

    return false
  }

  function handleRemoveQuestion(questionIndex: number) {
    remove(questionIndex)

    const remainingQuestions = getValues('questions')
    remainingQuestions.forEach((question, index) => {
      update(index, {
        ...question,
        questionNumber: index + 1,
      })
    })

    toast.success('Questão removida com sucesso.', {
      style: { filter: 'none', zIndex: 10 },
      position: 'top-center',
    })
  }

  async function handleAddAssessmentSubmit(data: AddAssessmentFormType) {
    const handleRequest = addAssessment(data)
    toast.promise(handleRequest, {
      loading: 'Adicionando avaliação...',
      success: () => {
        setTimeout(() => {
          redirect('/assessments')
        }, 500)
        return 'Avaliação adicionada com sucesso.'
      },
      error: 'Algo deu errado. Por favor, tente novamente mais tarde.',
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
  }

  return (
    <>
      <form
        className='relative flex flex-col gap-4 px-2 py-4 lg:gap-2 lg:px-6'
        onSubmit={handleSubmit(handleAddAssessmentSubmit)}
      >
        <Button variant={'green'} className='top-[-34px] right-0 sm:absolute'>
          Salvar Avaliação
        </Button>

        {/* NAME INPUT */}
        <div>
          <div className='flex items-center space-x-2'>
            <label className='font-medium text-base' htmlFor='name'>
              Nome:
            </label>
            <Input
              id='name'
              type='text'
              placeholder='Digite aqui'
              {...register('name')}
              className='max-w-md'
            />
          </div>
          {errors.name && (
            <p className='pt-0.5 text-destructive text-sm'>
              {errors.name.message}
            </p>
          )}
        </div>
        {/* CLASS SELECTION */}
        <div>
          <div className='flex items-center space-x-2'>
            <label className='font-medium text-base' htmlFor='assessmentDate'>
              Data da avaliação:
            </label>
            <Input
              id='assessmentDate'
              type='date'
              placeholder='Digite aqui'
              {...register('assessmentDate')}
              className='w-fit'
            />
          </div>
          {errors.assessmentDate && (
            <p className='pt-0.5 text-destructive text-sm'>
              {errors.assessmentDate.message}
            </p>
          )}
        </div>

        <section className='space-y-2 sm:mt-4'>
          <h2 className='font-semibold text-lg'>
            Selecione as turmas para esta avaliação:
          </h2>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* AVAILABLE CLASSES */}
            <div className='space-y-3'>
              <h3 className='font-medium text-base text-muted-foreground'>
                Turmas Disponíveis ({classList.length})
              </h3>
              <div className='max-h-80 overflow-y-auto rounded-lg border bg-muted/20 p-4'>
                <div className='space-y-3'>
                  {classList.map(classItem => (
                    <Card
                      key={classItem.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedClasses.find(c => c.id === classItem.id)
                          ? 'bg-primary/5 opacity-60 ring-2 ring-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        const isSelected = selectedClasses.find(
                          c => c.id === classItem.id
                        )
                        if (isSelected) {
                          setSelectedClasses(prev =>
                            prev.filter(c => c.id !== classItem.id)
                          )
                        } else {
                          setSelectedClasses(prev => [...prev, classItem])
                        }
                      }}
                    >
                      <CardContent className='p-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex-1'>
                            <h4 className='mb-1 font-medium text-sm'>
                              {classItem.name}
                            </h4>
                            <p className='text-muted-foreground text-xs'>
                              {classItem.category}
                            </p>
                          </div>
                          <div className='ml-2'>
                            <input
                              type='checkbox'
                              checked={
                                !!selectedClasses.find(
                                  c => c.id === classItem.id
                                )
                              }
                              onChange={() => {}} // Controlled by card click
                              className='size-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary'
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* SELECTED CLASSES */}
            <div className='space-y-3'>
              <h3 className='font-medium text-base text-muted-foreground'>
                Turmas Selecionadas ({selectedClasses.length})
              </h3>
              <div className='max-h-80 min-h-[200px] overflow-y-auto rounded-lg border bg-primary/5 p-4'>
                {selectedClasses.length === 0 ? (
                  <div className='flex h-full min-h-[150px] items-center justify-center text-center'>
                    <div>
                      <p className='mb-2 text-muted-foreground text-sm'>
                        Nenhuma turma selecionada
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Clique nas turmas à esquerda para selecioná-las
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {selectedClasses.map(classItem => (
                      <Card
                        key={classItem.id}
                        className='border-primary/20 bg-primary/10'
                      >
                        <CardContent className='p-3'>
                          <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                              <h4 className='mb-1 font-medium text-sm'>
                                {classItem.name}
                              </h4>
                              <p className='text-muted-foreground text-xs'>
                                {classItem.category}
                              </p>
                            </div>
                            <button
                              type='button'
                              onClick={() => {
                                setSelectedClasses(prev =>
                                  prev.filter(c => c.id !== classItem.id)
                                )
                              }}
                              className='ml-2 rounded-full p-1 text-destructive transition-colors hover:bg-destructive/10'
                              title={`Remover ${classItem.name}`}
                              aria-label={`Remover ${classItem.name}`}
                            >
                              <svg
                                className='size-4'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                aria-hidden='true'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M6 18L18 6M6 6l12 12'
                                />
                              </svg>
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {selectedClasses.length > 0 && (
                <div className='rounded bg-primary/10 p-2 text-center font-medium text-primary text-sm'>
                  ✓ {selectedClasses.length} turma
                  {selectedClasses.length > 1 ? 's' : ''} selecionada
                  {selectedClasses.length > 1 ? 's' : ''} para avaliação
                </div>
              )}
            </div>
          </div>
        </section>
        {errors.classes && (
          <p className='pt-2.5 text-center text-destructive text-sm'>
            {errors.classes.message}
          </p>
        )}
      </form>
      {/* ASSESSMENT QUESTIONS */}
      <div className='flex flex-col gap-4 pb-8 sm:mt-4 sm:gap-6'>
        <div className='flex flex-col justify-between sm:flex-rowitems-center'>
          <div>
            <h2 className='font-semibold text-lg'>Questões da Avaliação</h2>
            <p className='text-muted-foreground text-sm'>
              Soma atual das notas:{' '}
              <span className='font-medium text-primary'>
                {getCurrentScore()}/{MAX_SCORE}
              </span>
            </p>
          </div>

          {errors.questions && (
            <p className='text-destructive text-sm'>
              {errors.questions.message}
            </p>
          )}
        </div>

        {/* QUESTIONS LIST */}
        <div className='space-y-4'>
          {fields.length === 0 && (
            <Card className='border-2 border-muted-foreground/25 border-dashed'>
              <CardContent className='p-8 text-center'>
                <p className='mb-4 text-muted-foreground'>
                  Nenhuma questão adicionada ainda.
                </p>
                <Button
                  type='button'
                  variant={'outline'}
                  onClick={() =>
                    append({
                      questionNumber: 1,
                      categories: [],
                    })
                  }
                  className='mx-auto'
                >
                  <Plus className='mr-2 size-4' />
                  Adicionar primeira questão
                </Button>
              </CardContent>
            </Card>
          )}

          {fields.map((field, questionIndex) => (
            <Card key={field.id} className='overflow-hidden'>
              <CardContent className='p-0'>
                {/* Question Header */}
                <div className='border-b bg-muted/30 p-4'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-medium text-lg'>
                      Questão {field.questionNumber}
                    </h3>
                    <div className='flex items-center gap-2'>
                      {fields.length > 1 && (
                        <Button
                          type='button'
                          variant={'outline'}
                          size={'sm'}
                          onClick={() => handleRemoveQuestion(questionIndex)}
                          className='text-destructive hover:text-destructive'
                        >
                          <Trash2 className='mr-1 size-4' />
                          <p className='hidden sm:flex'>Remover questão</p>
                        </Button>
                      )}
                    </div>
                  </div>

                  {errors.questions?.[questionIndex]?.categories && (
                    <p className='mt-2 text-destructive text-sm'>
                      {errors.questions[questionIndex].categories.message}
                    </p>
                  )}
                </div>

                {/* Categories Section */}
                <div className='p-4'>
                  <div className='mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center'>
                    <h4 className='font-medium text-base'>
                      Categorias de Avaliação
                    </h4>
                    <AddCategoryDialog
                      questionNumber={field.questionNumber}
                      questionIndex={questionIndex}
                      handleAddCategory={handleAddCategoryToList}
                      getCurrentScore={getCurrentScore}
                      isDuplicated={(categoryName: string) =>
                        validateDuplicateCategoryName(
                          categoryName,
                          getValues('questions')
                        )
                      }
                    />
                  </div>

                  {/* Categories List */}
                  {watch(`questions.${questionIndex}.categories`, []).length ===
                  0 ? (
                    <div className='rounded-lg border-2 border-muted-foreground/25 border-dashed py-8 text-center text-muted-foreground'>
                      <p className='mb-2 text-sm sm:text-base'>
                        Nenhuma categoria adicionada a esta questão.
                      </p>
                      <p className='text-xs sm:text-sm'>
                        Clique em "Adicionar Categoria" para começar.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {watch(`questions.${questionIndex}.categories`).map(
                        (category: QuestionCategoryType, categoryIndex) => (
                          <div
                            key={category.name}
                            className='flex flex-wrap-reverse justify-between gap-0.5 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center'
                          >
                            <div className='flex items-center gap-3'>
                              <div className='min-w-12 rounded bg-primary px-2 py-1 text-center font-medium text-primary-foreground text-sm'>
                                {category.score}
                              </div>
                              <span className='font-medium'>
                                {category.name}
                              </span>
                            </div>
                            <div className='ml-auto flex items-center gap-2'>
                              <EditCategoryItem
                                handleEdit={handleEditCategoryItem}
                                category={category}
                                questionIndex={questionIndex}
                                categoryIndex={categoryIndex}
                              />
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  handleRemoveCategoryFromList(
                                    questionIndex,
                                    categoryIndex
                                  )
                                }
                                className='text-destructive hover:text-destructive'
                              >
                                <Trash2 className='size-4' />
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Question Button */}
        {fields.length > 0 && (
          <div className='flex justify-center'>
            <Button
              type='button'
              variant={'outline'}
              onClick={() =>
                append({
                  questionNumber: getValues('questions').length + 1,
                  categories: [],
                })
              }
              className='border-2 border-dashed'
            >
              <Plus className='mr-2 size-4' />
              Adicionar nova questão
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
