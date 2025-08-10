export function UpcomingAssessmentItem({
  title,
  date,
  classes,
}: { title: string; date: string; classes: number }) {
  return (
    <div className='border-input border-b p-4 last:border-0'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-medium'>{title}</h3>
          <p className='mt-1 text-gray-500 text-sm'>
            {classes}{' '}
            {classes === 1
              ? 'turma a ser avaliada'
              : 'turmas a serem avaliadas'}
          </p>
        </div>
        <div className='text-bluecolor text-sm'>{date}</div>
      </div>
    </div>
  )
}
