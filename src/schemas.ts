import { z } from 'zod'

export const addClassSchema = z.object({
  name: z.string().min(1, 'O nome da turma é obrigatório.'),
})

export type AddClassType = z.infer<typeof addClassSchema>
