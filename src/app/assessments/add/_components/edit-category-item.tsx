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
import {
  type AssessmentCategoryType,
  assessmentCategorySchema,
} from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { MAX_SCORE, MIN_SCORE } from '../../_helper/score'

export function EditCategoryItem({
  category,
  handleEdit,
  index,
}: {
  category: AssessmentCategoryType
  handleEdit: (
    category: AssessmentCategoryType,
    oldCategory: AssessmentCategoryType,
    index: number
  ) => boolean
  index: number
}) {
  const {
    register,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AssessmentCategoryType>({
    resolver: zodResolver(assessmentCategorySchema),
    defaultValues: {
      name: category.name,
      score: category.score,
    },
  })

  const oldName = category.name
  const oldScore = Number(category.score)

  function handleFormSubmit(e: React.MouseEvent) {
    const name = getValues('name')
    const score = Number(getValues('score'))
    let error = false
    if (!name || name === '' || name.trim() === '') {
      setError('name', { message: 'O nome da categoria é obrigatório.' })
      error = true
    } else {
      clearErrors('name')
    }
    if (score < MIN_SCORE || score > MAX_SCORE) {
      setError('score', {
        message: `A nota da categoria deve ser entre ${MIN_SCORE} e ${MAX_SCORE}`,
      })
      error = true
    } else {
      clearErrors('score')
    }
    if (error) {
      e.preventDefault()
      return
    }

    if (handleEdit({ name, score }, { name: oldName, score: oldScore }, index))
      e.preventDefault()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Editar</Button>
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
              {...register('score')}
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
