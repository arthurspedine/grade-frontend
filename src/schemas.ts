import { z } from 'zod'
import { MAX_SCORE, MIN_SCORE } from './app/assessments/_helper/score'

export const addClassFormSchema = z.object({
  name: z.string().min(1, 'O nome da turma é obrigatório.'),
  category: z.string().nonempty('Selecione uma categoria.'),
  csvFile: z
    .custom<File>()
    .refine(file => file !== undefined, 'Arquivo é obrigatório.')
    .refine(
      file =>
        file && (file.type !== 'text/csv' || !file.name?.endsWith('.csv')),
      'Por favor, envie apenas arquivos CSV.'
    ),
})

export const editClassFormSchema = addClassFormSchema.extend({
  csvFile: z
    .custom<File>()
    .optional()
    .refine(
      file => !file || file.type !== 'text/csv' || !file.name?.endsWith('.csv'),
      'Por favor, envie apenas arquivos CSV.'
    ),
})

export type AddClassFormType = z.infer<typeof addClassFormSchema>
export type EditClassFormType = z.infer<typeof editClassFormSchema>

export const assessmentCategorySchema = z.object({
  name: z.string().min(1, 'O nome da categoria é obrigatório.'),
  score: z
    .number()
    .min(MIN_SCORE, `A pontuação não pode ser menor que ${MIN_SCORE}.`)
    .max(MAX_SCORE, `A pontuação não pode exceder ${MAX_SCORE}.`),
})

export type AssessmentCategoryType = z.infer<typeof assessmentCategorySchema>

export const addAssessmentFormSchema = z.object({
  name: z.string().min(1, 'O nome da avaliação é obrigatório.'),
  classes: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(1, 'Ao menos uma turma deve ser selecionada.'),
  categories: z
    .array(assessmentCategorySchema)
    .min(1, 'Ao menos uma categoria deve ser adicionada.')
    .refine(
      categories =>
        categories.reduce((sum, category) => sum + category.score, 0) ===
        MAX_SCORE,
      {
        message: `A soma das pontuações deve ser igual a ${MAX_SCORE}.`,
      }
    ),
})

export type AddAssessmentFormType = z.infer<typeof addAssessmentFormSchema>
