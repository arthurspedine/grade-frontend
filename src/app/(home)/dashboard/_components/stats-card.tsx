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
    <div className='flex items-center rounded-lg bg-accent p-6 shadow-md'>
      <div className={`rounded-full p-3 ${color} mr-4`}>
        <Icon size={24} className='text-white' />
      </div>
      <div>
        <p className='text-gray-500 text-sm'>{title}</p>
        <p className='font-semibold text-2xl'>{value}</p>
      </div>
    </div>
  )
}
