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

export const questionCategorySchema = z.object({
  name: z.string().min(1, 'O nome da categoria é obrigatório.'),
  score: z
    .number()
    .min(MIN_SCORE, `A nota não pode ser menor que ${MIN_SCORE}.`)
    .max(MAX_SCORE, `A nota não pode exceder ${MAX_SCORE}.`)
    .refine(value => !Number.isNaN(Number(value)), {
      message: 'A nota deve ser um número válido.',
    })
    .refine(
      value => {
        const multiplied = Math.round(value * 100)
        return multiplied % 5 === 0
      },
      {
        message: 'A nota deve ser um múltiplo de 0.05.',
      }
    ),
})

export type QuestionCategoryType = z.infer<typeof questionCategorySchema>

const questionSchema = z.object({
  questionNumber: z.number(),
  categories: z
    .array(questionCategorySchema)
    .min(1, 'Ao menos uma categoria deve ser adicionada à questão.'),
})

export const addAssessmentFormSchema = z.object({
  name: z.string().min(1, 'O nome da avaliação é obrigatório.'),
  classes: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .min(1, 'Ao menos uma turma deve ser selecionada.'),
  questions: z
    .array(questionSchema)
    .min(1, 'Ao menos uma questão deve ser adicionada.')
    .refine(
      questions =>
        questions.reduce(
          (sum, question) =>
            sum +
            question.categories.reduce(
              (catSum, category) => catSum + category.score,
              0
            ),
          0
        ) === MAX_SCORE,
      {
        message: `A soma das notas deve ser igual a ${MAX_SCORE}.`,
      }
    ),
  assessmentDate: z
    .string()
    .refine(date => date !== null && date.trim() !== '', {
      message: 'A data da avaliação é obrigatória.',
    })
    .refine(
      val => {
        const date = new Date(`${val}T00:00:00`)
        return !Number.isNaN(date.getTime())
      },
      { message: 'A data da avaliação precisa ser uma data válida.' }
    )
    .refine(
      val => {
        const date = new Date(`${val}T00:00:00`)
        const now = new Date()
        return date.getTime() > now.getTime()
      },
      { message: 'A data da avaliação precisa ser no futuro.' }
    ),
})

export type AddAssessmentFormType = z.infer<typeof addAssessmentFormSchema>
