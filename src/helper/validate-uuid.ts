import { z } from 'zod'

const uuidSchema = z.string().uuid()

export function isValid(uuid: string): boolean {
  return uuidSchema.safeParse(uuid).success
}
