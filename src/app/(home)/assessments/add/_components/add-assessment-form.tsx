'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  type AddAssessmentFormType,
  type QuestionCategoryType,
  addAssessmentFormSchema,
} from '@/schemas'
import type { ClassType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { MAX_SCORE } from '../../_helper/score'
import { addAssessment } from '@/http/handle-http-assessments'
import { EditCategoryItem } from './edit-category-item'
import { AddCategoryDialog } from './add-category-dialog'
import { Plus, Trash2 } from 'lucide-react'
import {
  validateNewScore,
  validateDuplicateCategoryName,
} from '../shared-validation'

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
        className='flex flex-col px-8 py-4 relative'
        onSubmit={handleSubmit(handleAddAssessmentSubmit)}
      >
        <Button variant={'green'} className='absolute right-0 top-[-34px]'>
          Salvar Avaliação
        </Button>
        {/* NAME INPUT */}
        <div>
          <div className='flex space-x-2 items-center'>
            <label className='text-base font-medium' htmlFor='name'>
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
            <p className='text-destructive text-sm pt-0.5'>
              {errors.name.message}
            </p>
          )}
        </div>
        <div className='mt-2'>
          <div className='flex space-x-2 items-center'>
            <label className='text-base font-medium' htmlFor='assessmentDate'>
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
            <p className='text-destructive text-sm pt-0.5'>
              {errors.assessmentDate.message}
            </p>
          )}
        </div>

        {/* CLASS SELECTION */}
        <section className='mt-8'>
          <h2 className='font-semibold text-lg mb-4'>
            Selecione as turmas para esta avaliação:
          </h2>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* AVAILABLE CLASSES */}
            <div className='space-y-3'>
              <h3 className='font-medium text-base text-muted-foreground'>
                Turmas Disponíveis ({classList.length})
              </h3>
              <div className='border rounded-lg p-4 bg-muted/20 max-h-80 overflow-y-auto'>
                <div className='space-y-3'>
                  {classList.map(classItem => (
                    <Card
                      key={classItem.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedClasses.find(c => c.id === classItem.id)
                          ? 'ring-2 ring-primary bg-primary/5 opacity-60'
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
                            <h4 className='font-medium text-sm mb-1'>
                              {classItem.name}
                            </h4>
                            <p className='text-xs text-muted-foreground'>
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
                              className='size-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2'
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
              <div className='border rounded-lg p-4 bg-primary/5 min-h-[200px] max-h-80 overflow-y-auto'>
                {selectedClasses.length === 0 ? (
                  <div className='flex items-center justify-center h-full min-h-[150px] text-center'>
                    <div>
                      <p className='text-muted-foreground text-sm mb-2'>
                        Nenhuma turma selecionada
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Clique nas turmas à esquerda para selecioná-las
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {selectedClasses.map(classItem => (
                      <Card
                        key={classItem.id}
                        className='bg-primary/10 border-primary/20'
                      >
                        <CardContent className='p-3'>
                          <div className='flex items-center justify-between'>
                            <div className='flex-1'>
                              <h4 className='font-medium text-sm mb-1'>
                                {classItem.name}
                              </h4>
                              <p className='text-xs text-muted-foreground'>
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
                              className='ml-2 text-destructive hover:bg-destructive/10 rounded-full p-1 transition-colors'
                              title={`Remover ${classItem.name}`}
                              aria-label={`Remover ${classItem.name}`}
                            >
                              <svg
                                className='w-4 h-4'
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
                <div className='text-center p-2 bg-primary/10 rounded text-sm text-primary font-medium'>
                  ✓ {selectedClasses.length} turma
                  {selectedClasses.length > 1 ? 's' : ''} selecionada
                  {selectedClasses.length > 1 ? 's' : ''} para avaliação
                </div>
              )}
            </div>
          </div>
        </section>
        {errors.classes && (
          <p className='text-destructive text-sm pt-2.5 text-center'>
            {errors.classes.message}
          </p>
        )}
      </form>
      {/* ASSESSMENT QUESTIONS */}
      <div className='flex flex-col space-y-6 pb-4 mt-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='font-semibold text-lg'>Questões da Avaliação</h2>
            <p className='text-sm text-muted-foreground'>
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
            <Card className='border-dashed border-2 border-muted-foreground/25'>
              <CardContent className='p-8 text-center'>
                <p className='text-muted-foreground mb-4'>
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
                  <Plus className='w-4 h-4 mr-2' />
                  Adicionar primeira questão
                </Button>
              </CardContent>
            </Card>
          )}

          {fields.map((field, questionIndex) => (
            <Card key={field.id} className='overflow-hidden'>
              <CardContent className='p-0'>
                {/* Question Header */}
                <div className='bg-muted/30 p-4 border-b'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-medium'>
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
                          <Trash2 className='w-4 h-4 mr-1' />
                          Remover questão
                        </Button>
                      )}
                    </div>
                  </div>

                  {errors.questions?.[questionIndex]?.categories && (
                    <p className='text-destructive text-sm mt-2'>
                      {errors.questions[questionIndex].categories.message}
                    </p>
                  )}
                </div>

                {/* Categories Section */}
                <div className='p-4'>
                  <div className='flex items-center justify-between mb-4'>
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
                    <div className='text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/25 rounded-lg'>
                      <p className='mb-2'>
                        Nenhuma categoria adicionada a esta questão.
                      </p>
                      <p className='text-sm'>
                        Clique em "Adicionar Categoria" para começar.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {watch(`questions.${questionIndex}.categories`).map(
                        (category: QuestionCategoryType, categoryIndex) => (
                          <div
                            key={category.name}
                            className='flex items-center justify-between p-3 bg-muted/20 rounded-lg border'
                          >
                            <div className='flex items-center gap-3'>
                              <div className='bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium min-w-[3rem] text-center'>
                                {category.score}
                              </div>
                              <span className='font-medium'>
                                {category.name}
                              </span>
                            </div>
                            <div className='flex items-center gap-2'>
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
                                <Trash2 className='w-4 h-4' />
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
              className='border-dashed border-2'
            >
              <Plus className='w-4 h-4 mr-2' />
              Adicionar nova questão
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
