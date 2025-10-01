// Utility functions for leaderboard formatting
export const HIT_COLORS = {
  0: 'text-red-500',
  50: 'text-orange-500',
  100: 'text-yellow-500',
  200: 'text-green-500',
  300: 'text-blue-500',
} as const

export const formatScore = (score: number): string => {
  return score.toLocaleString()
}

export const formatAccuracy = (accuracy: number): string => {
  return `${(accuracy * 100).toFixed(2)}%`
}

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString()
}
