export function UpcomingAssessmentItem({
  title,
  date,
  classes,
}: { title: string; date: string; classes: number }) {
  return (
    <div className='p-4 border-b border-input last:border-0'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='font-medium'>{title}</h3>
          <p className='text-gray-500 text-sm mt-1'>
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
