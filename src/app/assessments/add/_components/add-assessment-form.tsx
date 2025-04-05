'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { addAssessment } from '../../_http/handle-http-assessments'
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

  const [availableClasses, setAvailableClasses] =
    useState<ClassType[]>(classList)
  const [selectedClasses, setSelectedClasses] = useState<ClassType[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null)

  useEffect(() => {
    setValue(
      'classes',
      selectedClasses.map(c => ({ id: c.id }))
    )
    clearErrors('classes')
  }, [selectedClasses, setValue, clearErrors])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedClass) {
        const target = event.target as HTMLElement

        if (!target.closest('.bg-card') && !target.closest('button')) {
          setSelectedClass(null)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedClass])

  function handleDragStart(card: ClassType) {
    setSelectedClass(card)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  const moveCard = (fromList: string, toList: string) => {
    if (!selectedClass) return

    const sourceList =
      fromList === 'available' ? availableClasses : selectedClasses
    const newSourceList = sourceList.filter(
      card => card.id !== selectedClass.id
    )

    const targetList =
      toList === 'available' ? availableClasses : selectedClasses

    // if the user drops in the same "from" column
    if (targetList.find(card => card.id === selectedClass.id)) return
    const newTargetList = [...targetList, selectedClass]

    if (fromList === 'available') {
      setAvailableClasses(newSourceList)
      setSelectedClasses(newTargetList)
    } else {
      setSelectedClasses(newSourceList)
      setAvailableClasses(newTargetList)
    }
    setSelectedClass(null)
  }

  const moveSelectedCard = () => {
    if (!selectedClass) return

    if (availableClasses.find(card => card.id === selectedClass.id)) {
      moveCard('available', 'selected')
    } else {
      moveCard('selected', 'available')
    }
  }

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
            />
          </div>
          {errors.name && (
            <p className='text-destructive text-sm pt-0.5'>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* CLASS SELECTION */}
        <section className='min-h-96 max-h-96 w-full flex justify-center items-center space-x-12 mt-8'>
          {/* AVAILABLE CLASSES */}
          <div className='h-full w-64 flex flex-col space-y-1'>
            <h2 className='font-semibold text-xl text-center'>
              Turmas Disponíveis
            </h2>
            {/* CARD BOX */}
            <div
              className='scrollbar-custom bg-slate-50/5 h-full w-full border-border border-8 border-r-0 overflow-y-scroll rounded-lg'
              onDragOver={handleDragOver}
              onDrop={() => moveCard('selected', 'available')}
            >
              {availableClasses.map(c => (
                <Card
                  key={c.id}
                  draggable
                  selected={selectedClass?.id === c.id}
                  onDragStart={() => handleDragStart(c)}
                  onClick={() => setSelectedClass(c)}
                >
                  <CardContent>{c.name}</CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* ARROW BUTTON */}
          <Button
            type='button'
            onClick={moveSelectedCard}
            disabled={selectedClass === null}
          >
            {selectedClass &&
            !availableClasses.find(card => card.id === selectedClass.id)
              ? '<'
              : '>'}
          </Button>
          {/* SELECTED CLASSES */}
          <div className='h-full w-64 flex flex-col space-y-1'>
            <h2 className='font-semibold text-xl text-center'>
              Turmas Selecionadas
            </h2>
            {/* CARD BOX */}
            <div
              className='scrollbar-custom bg-slate-50/5 h-full w-full border-border border-8 border-r-0 overflow-y-scroll rounded-lg'
              onDragOver={handleDragOver}
              onDrop={() => moveCard('available', 'selected')}
            >
              {selectedClasses.map(c => (
                <Card
                  key={c.id}
                  draggable
                  selected={selectedClass?.id === c.id}
                  onDragStart={() => handleDragStart(c)}
                  onClick={() => setSelectedClass(c)}
                >
                  <CardContent>{c.name}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {errors.classes && (
          <p className='text-destructive text-sm pt-2.5 text-center'>
            {errors.classes.message}
          </p>
        )}
      </form>

      {/* ASSESSMENT CATEGORIES */}
      <div className='flex flex-col space-y-4'>
        {/* CATEGORY FORM FOR NAME AND SCORE */}
        <div className='flex items-center justify-between'>
          <p className='font-medium'>
            Soma notas: {getCurrentScore().toString()}/{MAX_SCORE}
          </p>

          {errors.questions && (
            <p className='text-destructive text-sm'>
              {errors.questions.message}
            </p>
          )}

          <Button
            type='button'
            variant={'secondary'}
            onClick={() =>
              append({
                questionNumber: getValues('questions').length + 1,
                categories: [],
              })
            }
          >
            <Plus />
            Adicionar questão
          </Button>
        </div>
        {fields.map((field, questionIndex) => (
          <div
            key={field.id}
            className='border-b-2 border-border pb-2 space-y-2'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <h3 className='text-lg'>Questão N°{field.questionNumber}</h3>
                <Button
                  type='button'
                  variant={'destructive'}
                  size={'sm'}
                  onClick={() => handleRemoveQuestion(questionIndex)}
                >
                  <Trash2 />
                  Remover questão
                </Button>
              </div>
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
            {errors.questions?.[questionIndex]?.categories && (
              <p className='text-destructive text-sm'>
                {errors.questions[questionIndex].categories.message}
              </p>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-16'>Nota</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watch(`questions.${questionIndex}.categories`).map(
                  (category: QuestionCategoryType, categoryIndex) => (
                    <TableRow key={category.name}>
                      <TableCell className='font-medium'>
                        {category.score}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell className='w-full flex justify-end space-x-4'>
                        <EditCategoryItem
                          handleEdit={handleEditCategoryItem}
                          category={category}
                          questionIndex={questionIndex}
                          categoryIndex={categoryIndex}
                        />
                        <Button
                          type='button'
                          variant='destructive'
                          onClick={() =>
                            handleRemoveCategoryFromList(
                              questionIndex,
                              categoryIndex
                            )
                          }
                        >
                          <Trash2 />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
                {watch(`questions.${questionIndex}.categories`, []).length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className='text-center py-4 text-muted-foreground'
                    >
                      Nenhuma categoria adicionada a esta questão.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </>
  )
}
