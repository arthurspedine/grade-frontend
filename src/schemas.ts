import { z } from 'zod'

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
