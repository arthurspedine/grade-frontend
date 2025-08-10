'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { type QuestionCategoryType, questionCategorySchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { MAX_SCORE, MIN_SCORE } from '../../_helper/score'
import { validateCategoryForm, validateNewScore } from '../shared-validation'

interface AddCategoryDialogProps {
  questionNumber: number
  questionIndex: number
  handleAddCategory: (
    newCategory: QuestionCategoryType,
    questionIndex: number
  ) => void
  getCurrentScore: () => number
  isDuplicated: (categoryName: string) => boolean
}

export function AddCategoryDialog({
  questionNumber,
  questionIndex,
  handleAddCategory,
  getCurrentScore,
  isDuplicated,
}: AddCategoryDialogProps) {
  const {
    register,
    formState: { errors },
    setError,
    getValues,
    clearErrors,
    reset,
    setValue,
  } = useForm<QuestionCategoryType>({
    resolver: zodResolver(questionCategorySchema),
    defaultValues: {
      score: 0,
    },
  })

  function handleValidateCategory(e: React.MouseEvent) {
    const name = getValues('name')
    const score = Number(getValues('score'))

    const validation = validateCategoryForm(name, score, setError, clearErrors)

    if (!validation.isValid) {
      e.preventDefault()
      return
    }

    const newScore = getCurrentScore() + score

    if (!validateNewScore(newScore)) {
      e.preventDefault()
      return
    }

    if (isDuplicated(name)) {
      e.preventDefault()
      return
    }

    const newCategory = { name: name, score: score }
    handleAddCategory(newCategory, questionIndex)

    reset({
      name: '',
      score: 0,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Adicionar categoria à questão {questionNumber}
          </DialogTitle>
          <DialogDescription>
            Digite as informações da nova categoria. Clique em 'Adicionar
            categoria' quando estiver pronto.
          </DialogDescription>
        </DialogHeader>
        <form className='space-y-4'>
          {/* CATEGORY NAME */}
          <div className='w-full'>
            <div className='flex w-full flex-col space-y-1'>
              <label
                className='flex-shrink-0 font-medium text-base'
                htmlFor='name'
              >
                Categoria de avaliação:
              </label>
              <Input
                id='name'
                type='text'
                placeholder='Digite aqui'
                className='w-full'
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className='pt-0.5 text-destructive text-sm'>
                {errors.name.message}
              </p>
            )}
          </div>
          {/* CATEGORY SCORE */}
          <div>
            <div className='flex w-full items-center space-x-2'>
              <label className='font-medium text-base' htmlFor='score'>
                Nota:
              </label>
              <Input
                id='score'
                type='number'
                min={MIN_SCORE}
                max={MAX_SCORE}
                placeholder='Digite aqui'
                className='w-32'
                step={0.05}
                {...register('score', { valueAsNumber: true })}
                onBlur={e => {
                  const value = Number.parseFloat(e.target.value)
                  if (!Number.isNaN(value)) {
                    const rounded = Math.round(value * 20) / 20
                    setValue('score', rounded)
                  }
                }}
              />
            </div>
            {errors.score && (
              <p className='pt-0.5 text-destructive text-sm'>
                {errors.score.message}
              </p>
            )}
          </div>
          <DialogFooter className='flex flex-row gap-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline' className='w-full'>
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant={'green'}
                className='w-full'
                onClick={handleValidateCategory}
              >
                Adicionar categoria
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
