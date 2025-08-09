import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent } from 'react'

export function StatsCard({
  icon,
  title,
  value,
  color,
}: {
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'>>
  title: string
  value: number
  color: string
}) {
  const Icon = icon
  return (
    <div className='bg-accent rounded-lg p-6 shadow-md flex items-center'>
      <div className={`p-3 rounded-full ${color} mr-4`}>
        <Icon size={24} className='text-white' />
      </div>
      <div>
        <p className='text-gray-500 text-sm'>{title}</p>
        <p className='text-2xl font-semibold'>{value}</p>
      </div>
    </div>
  )
}
