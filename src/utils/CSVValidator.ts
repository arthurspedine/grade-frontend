import type { StudentType } from '@/schemas'

interface ValidationError {
  message: string
}

export class CSVValidator {
  private static readonly REQUIRED_HEADERS: string[] = ['rm', 'name']
  private static readonly MIN_STUDENTS: number = 10

  static validateHeaders(headers: string[]): ValidationError | null {
    const normalizedHeaders = headers.map(h => h.trim().toLowerCase())
    const isValid = CSVValidator.REQUIRED_HEADERS.every(
      (header, index) => normalizedHeaders[index] === header
    )

    return isValid
      ? null
      : {
          message: `O .csv deve ter exatamente as colunas: ${CSVValidator.REQUIRED_HEADERS.join(
            ', '
          )}`,
        }
  }

  static validateStudentCount(count: number): ValidationError | null {
    return count < CSVValidator.MIN_STUDENTS
      ? {
          message: `O arquivo deve conter pelo menos ${CSVValidator.MIN_STUDENTS} estudantes`,
        }
      : null
  }

  static validateStudentLine(
    line: string,
    lineNumber: number
  ): StudentType | ValidationError {
    const [rm, name] = line.split(',').map(item => item.trim())

    if (!rm || !name) {
      return {
        message: `Linha ${lineNumber}: Formato inválido. Cada linha deve ter RM e nome separados por vírgula`,
      }
    }

    return { rm, name }
  }
}
