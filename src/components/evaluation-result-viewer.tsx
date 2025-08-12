import { Progress } from '@radix-ui/react-progress'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from './ui/card'

export function EvaluationResultsViewer({
  name,
  score,
  answeredScore,
}: { name: string; score: number; answeredScore: number }) {
  const categoryPercentage = (answeredScore / score) * 100
  const isExcellent = categoryPercentage >= 80
  const isGood = categoryPercentage >= 60

  return (
    <Card
      className={`border-l-4 transition-colors ${
        isExcellent
          ? 'border-l-green-500 bg-green-50/50 dark:border-l-green-400 dark:bg-green-950/20'
          : isGood
            ? 'border-l-yellow-500 bg-yellow-50/50 dark:border-l-yellow-400 dark:bg-yellow-950/20'
            : 'border-l-red-500 bg-red-50/50 dark:border-l-red-400 dark:bg-red-950/20'
      }`}
    >
      <CardContent className='p-4'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h4 className='font-medium text-foreground text-sm'>{name}</h4>
            {isExcellent && (
              <CheckCircle2 className='size-4 text-green-600 dark:text-green-400' />
            )}
          </div>

          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Pontuação:</span>
            <span className='font-bold text-foreground'>
              {answeredScore.toFixed(2)} / {score}
            </span>
          </div>

          <Progress
            value={categoryPercentage}
            className={`h-2 ${
              isExcellent
                ? '[&>div]:bg-green-500 dark:[&>div]:bg-green-400'
                : isGood
                  ? '[&>div]:bg-yellow-500 dark:[&>div]:bg-yellow-400'
                  : '[&>div]:bg-red-500 dark:[&>div]:bg-red-400'
            }`}
          />

          <div className='text-center'>
            <span
              className={`font-medium text-xs ${
                isExcellent
                  ? 'text-green-700 dark:text-green-300'
                  : isGood
                    ? 'text-yellow-700 dark:text-yellow-300'
                    : 'text-red-700 dark:text-red-300'
              }`}
            >
              {categoryPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
