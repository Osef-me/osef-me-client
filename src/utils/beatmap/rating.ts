type Rating = {
  rating_type: string
  rating_value: number
}

type Beatmap = {
  ratings?: Rating[]
}

const DEFAULT_RATING_TYPES = ['etterna', 'osu', 'sunnyxxy'] as const

/**
 * Find the best rating for a beatmap based on the requested type
 * Falls back to default types if exact match not found
 */
export function findBestRating(beatmap: Beatmap, requestedType: string): Rating | null {
  const ratings = beatmap.ratings || []
  
  // Try exact match first
  const exact = ratings.find((r) => r.rating_type === requestedType)
  if (exact) return exact

  // Try fallback types
  for (const type of DEFAULT_RATING_TYPES) {
    if (type !== requestedType) {
      const fallback = ratings.find((r) => r.rating_type === type)
      if (fallback) return fallback
    }
  }

  // Return first available rating
  return ratings[0] || null
}

