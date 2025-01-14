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
import { type AddAssessmentFormType, addAssessmentFormSchema } from '@/schemas'
import type { ClassType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const MIN_SCORE = 1
const MAX_SCORE = 100

export function AddAssessmentForm({ classList }: { classList: ClassType[] }) {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<AddAssessmentFormType>({
    resolver: zodResolver(addAssessmentFormSchema),
    defaultValues: {
      classes: [],
      categories: [],
    },
  })

  const [availableClasses, setAvailableClasses] =
    useState<ClassType[]>(classList)
  const [selectedClasses, setSelectedClasses] = useState<ClassType[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null)

  const [assessmentCategoriesList, setAssessmentCategoriesList] = useState<
    {
      name: string
      score: number
    }[]
  >([])

  const [categoryName, setCategoryName] = useState<string>('')
  const [categoryNameError, setCategoryNameError] = useState<string>('')
  const [categoryScore, setCategoryScore] = useState<number>(0)
  const [categoryScoreError, setCategoryScoreError] = useState<string>('')

  useEffect(() => {
    setValue(
      'classes',
      selectedClasses.map(c => ({ id: c.id }))
    )
    clearErrors('classes')
  }, [selectedClasses, setValue, clearErrors])

  useEffect(() => {
    setValue('categories', assessmentCategoriesList)
    clearErrors('categories')
  }, [assessmentCategoriesList, setValue, clearErrors])

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

  function handleAddCategoryToList(e: React.FormEvent) {
    e.preventDefault()

    let error = false
    if (!categoryName || categoryName === '' || categoryName.trim() === '') {
      setCategoryNameError('O nome da categoria não pode ser nulo.')
      error = true
    } else {
      setCategoryNameError('')
    }
    if (categoryScore < MIN_SCORE || categoryScore > MAX_SCORE) {
      setCategoryScoreError(
        `A nota da categoria deve ser entre ${MIN_SCORE} e ${MAX_SCORE}`
      )
      error = true
    } else {
      setCategoryScoreError('')
    }
    if (error) return

    const newScore = getCurrentScore() + categoryScore
    if (!isNewScoreValid(newScore)) return

    const categoryDuplicatedName = assessmentCategoriesList.find(
      c => c.name.toLocaleLowerCase() === categoryName.toLocaleLowerCase()
    )
    if (categoryDuplicatedName) {
      toast.error('Nome da categoria duplicado. Por favor, altere o valor.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      return
    }

    const newCategory = { name: categoryName, score: categoryScore }
    setAssessmentCategoriesList(prev => [...prev, newCategory])

    setCategoryName('')
    setCategoryScore(0)
    toast.success('Categoria adicionada com sucesso!', {
      style: { filter: 'none', zIndex: 10 },
      position: 'top-center',
    })
  }

  function getCurrentScore(): number {
    return assessmentCategoriesList.reduce(
      (sum, category) => sum + category.score,
      0
    )
  }

  function handleRemoveCategoryFromList(index: number) {
    setAssessmentCategoriesList(prev => {
      const newList = [...prev]
      newList.splice(index, 1)
      return newList
    })
  }

  function isNewScoreValid(newScore: number): boolean {
    if (newScore > MAX_SCORE) {
      toast.error(`A nova nota ultrapassa o limite de ${MAX_SCORE}.`, {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
      return false
    }
    return true
  }

  async function handleAddAssessmentSubmit(data: AddAssessmentFormType) {
    console.log(data)
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
              className='scrollbar-custom bg-slate-50 h-full w-full border-border border-8 border-r-0 overflow-y-scroll rounded-lg'
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
            &gt;
          </Button>
          {/* SELECTED CLASSES */}
          <div className='h-full w-64 flex flex-col space-y-1'>
            <h2 className='font-semibold text-xl text-center'>
              Turmas Selecionadas
            </h2>
            {/* CARD BOX */}
            <div
              className='scrollbar-custom bg-slate-50 h-full w-full border-border border-8 border-r-0 overflow-y-scroll rounded-lg'
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
        <form className='space-y-4' onSubmit={handleAddCategoryToList}>
          <div className='flex w-full space-x-8'>
            <div className='w-full'>
              <div className='flex items-center w-full space-x-2'>
                <label
                  className='text-base font-medium flex-shrink-0'
                  htmlFor='name'
                >
                  Categoria de avaliação:
                </label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Digite aqui'
                  className='w-full'
                  value={categoryName}
                  onChange={e => {
                    setCategoryName(e.target.value)
                  }}
                />
              </div>
              <p className='text-destructive text-sm pt-0.5'>
                {categoryNameError}
              </p>
            </div>
            <div className='w-72'>
              <div className='flex items-center w-full space-x-2'>
                <label className='text-base font-medium' htmlFor='score'>
                  Nota:
                </label>
                <Input
                  id='score'
                  type='number'
                  value={categoryScore}
                  onChange={e => {
                    setCategoryScore(Number(e.target.value))
                  }}
                  min={MIN_SCORE}
                  max={MAX_SCORE}
                  placeholder='Digite aqui'
                  className='w-full'
                />
              </div>
              <p className='text-destructive text-sm pt-0.5'>
                {categoryScoreError}
              </p>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <p className='font-medium'>
              Nota da lista: {getCurrentScore()}/{MAX_SCORE}
            </p>

            {errors.categories && (
              <p className='text-destructive text-sm'>
                {errors.categories.message}
              </p>
            )}

            <Button type='submit'>Adicionar à lista</Button>
          </div>
        </form>

        {/* CATEGORIES TABLE */}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16'>Nota</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessmentCategoriesList.map((category, i) => (
              <TableRow key={category.name}>
                <TableCell className='font-medium'>{category.score}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className='w-full flex justify-end'>
                  <Button
                    type='button'
                    variant={'destructive'}
                    onClick={() => {
                      handleRemoveCategoryFromList(i)
                    }}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
