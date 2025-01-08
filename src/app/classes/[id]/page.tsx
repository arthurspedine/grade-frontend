'use server'
import { isValid } from '@/helper/validate-uuid'
import { redirect } from 'next/navigation'

export default async function ClassInfoPage({
  params,
}: { params: { id: string } }) {
  const { id } = await params
  if (!isValid(id)) {
    redirect('/classes')
  }
  return (
    <section className='max-w-[1440px] mx-auto w-full px-8 flex-grow'>
      <h1>Class {id}</h1>
    </section>
  )
}
