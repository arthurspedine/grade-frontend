'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { type QuestionCategoryType, questionCategorySchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { MAX_SCORE, MIN_SCORE } from '../../_helper/score'
import { Pen } from 'lucide-react'
import { validateCategoryForm } from '../shared-validation'

export function EditCategoryItem({
  category,
  handleEdit,
  categoryIndex,
  questionIndex,
}: {
  category: QuestionCategoryType
  handleEdit: (
    category: QuestionCategoryType,
    categoryIndex: number,
    questionIndex: number
  ) => boolean
  categoryIndex: number
  questionIndex: number
}) {
  const {
    register,
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<QuestionCategoryType>({
    resolver: zodResolver(questionCategorySchema),
    defaultValues: {
      name: category.name,
      score: category.score,
    },
  })

  function handleFormSubmit(e: React.MouseEvent) {
    const name = getValues('name')
    const score = getValues('score')

    const validation = validateCategoryForm(name, score, setError, clearErrors)

    if (!validation.isValid) {
      e.preventDefault()
      return
    }

    if (handleEdit({ name, score }, categoryIndex, questionIndex))
      e.preventDefault()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>
          <Pen />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar categoria</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Edite o nome ou nota da categoria selecionada.
        </DialogDescription>
        <div className='flex flex-col space-y-1'>
          <div className='flex items-center space-x-2'>
            <label
              className='text-base font-medium flex-shrink-0'
              htmlFor='name'
            >
              Nome da Categoria:
            </label>
            <Input
              id='name'
              type='text'
              placeholder='Digite aqui'
              className='w-full'
              defaultValue={category.name}
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className='text-destructive text-sm pt-0.5 pb-1'>
              {errors.name.message}
            </p>
          )}
          <div className='flex items-center space-x-2'>
            <label className='text-base font-medium' htmlFor='score'>
              Nota:
            </label>
            <Input
              id='score'
              type='number'
              defaultValue={category.score}
              min={MIN_SCORE}
              max={MAX_SCORE}
              placeholder='Digite aqui'
              className='w-24'
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
            <p className='text-destructive text-sm pt-0.5 pb-1'>
              {errors.score.message}
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant={'outline'}>
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type='submit' onClick={handleFormSubmit}>
              Salvar alterações
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
