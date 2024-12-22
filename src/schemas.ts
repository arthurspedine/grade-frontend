import { z } from 'zod'

export const genericClassFormSchema = z.object({
  name: z.string().min(1, 'O nome da turma é obrigatório.'),
})

export type GenericClassFormType = z.infer<typeof genericClassFormSchema>
