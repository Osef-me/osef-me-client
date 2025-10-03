import type { PaginatedResponse } from '@/types'
import type { BeatmapsetShort } from '@/types/beatmap/short'
import { apiClient } from './client'

export async function getBeatmaps(params?: Record<string, string | number | boolean | undefined>) {
  return apiClient.get<PaginatedResponse<BeatmapsetShort>>('beatmapsets', { params })
}

export async function getRandomBeatmaps(params?: Record<string, string | number | boolean | undefined>) {
  return apiClient.get<PaginatedResponse<BeatmapsetShort>>('beatmapsets/random', { params })
}
