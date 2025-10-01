import type { Beatmapset, Rates } from '@/types/beatmap/detail'
import { apiClient } from './client'

/**
 * Service pour récupérer les détails d'un beatmapset
 */
export async function getBeatmapset(beatmapsetOsuId: number): Promise<Beatmapset> {
  return apiClient.get<Beatmapset>(`beatmapsets/${beatmapsetOsuId}`)
}

/**
 * Service pour récupérer les données de rating d'une beatmap avec un centirate spécifique
 */
export async function getRates(beatmapOsuId: number, centirate: number): Promise<Rates> {
  console.log('getRates', beatmapOsuId, centirate)
  const a = await apiClient.get<Rates>(`beatmaps/${beatmapOsuId}/rates/${centirate}`)
  console.log('a', a)
  return a
}

/**
 * Service pour récupérer les données de rating d'une beatmap avec le centirate par défaut (100)
 */
export async function getRatesDefault(beatmapOsuId: number): Promise<Rates> {
  return getRates(beatmapOsuId, 100)
}
