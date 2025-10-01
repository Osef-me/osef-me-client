import type { ColorName } from '@/types/colors'

/**
 * Fonction commune pour obtenir la couleur en fonction du rating (chiffre)
 * Utilisée pour les badges de difficulté et le radar chart
 */
export const getRatingColor = (rating: number): ColorName => {
  if (rating >= 38) return 'black'
  if (rating >= 34) return 'purple'
  if (rating >= 30) return 'red'
  if (rating >= 25) return 'orange'
  if (rating >= 15) return 'yellow'
  if (rating >= 10) return 'green'
  return 'blue'
}
