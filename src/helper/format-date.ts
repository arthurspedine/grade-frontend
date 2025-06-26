export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number)

  const date = new Date(year, month - 1, day)

  const formattedDay = String(date.getDate()).padStart(2, '0')
  const formattedMonth = String(date.getMonth() + 1).padStart(2, '0')

  return `${formattedDay}/${formattedMonth}/${date.getFullYear()}`
}

export function formatUpcomingDate(date: string) {
  const [year, monthStr, day] = date.split('-').map(Number)

  const monthNames = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]
  const month = monthNames[Number(monthStr) - 1]

  return `${String(day).padStart(2, '0')} ${month}`
}
