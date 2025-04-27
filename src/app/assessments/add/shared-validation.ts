import type { QuestionCategoryType } from '@/schemas'
import type { UseFormClearErrors, UseFormSetError } from 'react-hook-form'
import { MAX_SCORE, MIN_SCORE } from '../_helper/score'
import { toast } from 'sonner'

export interface ValidationResult {
  isValid: boolean
  errorFields: string[]
}

export function validateCategoryForm(
  name: string,
  score: number,
  setError: UseFormSetError<QuestionCategoryType>,
  clearErrors: UseFormClearErrors<QuestionCategoryType>
): ValidationResult {
  let isValid = true
  const errorFields: string[] = []

  if (!name || name === '' || name.trim() === '') {
    setError('name', { message: 'O nome da categoria é obrigatório.' })
    isValid = false
    errorFields.push('name')
  } else {
    clearErrors('name')
  }

  if (score < MIN_SCORE || score > MAX_SCORE) {
    setError('score', {
      message: `A nota da categoria deve ser entre ${MIN_SCORE} e ${MAX_SCORE}`,
    })
    isValid = false
    errorFields.push('score')
  } else if (Number.isNaN(Number(score))) {
    setError('score', {
      message: 'A nota deve ser um número válido.',
    })
    isValid = false
    errorFields.push('score')
  } else {
    clearErrors('score')
  }

  return { isValid, errorFields }
}

export function validateNewScore(newScore: number): boolean {
  if (newScore > MAX_SCORE) {
    toast.error(`A nova nota ultrapassa o limite de ${MAX_SCORE}.`, {
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
    return false
  }

  return true
}

export function validateDuplicateCategoryName(
  name: string,
  questions: Array<{ categories: QuestionCategoryType[] }>
): boolean {
  const isDuplicate = questions.some(question =>
    question.categories.some(category => {
      return category.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    })
  )

  if (isDuplicate) {
    toast.error('Nome da categoria duplicado. Por favor, altere o valor.', {
      position: 'top-center',
      style: { filter: 'none', zIndex: 10 },
    })
    return true
  }

  return false
}
