export function PerformanceBar({
  name,
  score,
}: { name?: string; score: number }) {
  let barColor = 'bg-red-400'

  if (score >= 80) barColor = 'bg-gradient-to-r from-green-400 to-green-600'
  else if (score >= 70) barColor = 'bg-gradient-to-r from-blue-400 to-blue-600'
  else if (score >= 60)
    barColor = 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  else barColor = 'bg-gradient-to-r from-red-400 to-red-600'

  return (
    <div>
      <div className='mb-1 flex justify-between'>
        <span className='font-medium text-sm'>{name}</span>
        <span className='font-semibold text-sm'>{score}%</span>
      </div>
      <div className='h-2 w-full rounded-full bg-gray-200'>
        <div
          className={`${barColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
