export type ClassType = {
  id: string
  name: string
  category: string
  active: boolean
}

export type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  // biome-ignore lint/suspicious/noExplicitAny: receive any context
  body?: any
}

export type StudentType = {
  rm: string
  name: string
}

export type ClassInfoType = {
  details: ClassType
  students: StudentType[]
}

export type AssessmentDetailsType = {
  id: string
  name: string
  classes: {
    id: string
    name: string
  }[]
}
