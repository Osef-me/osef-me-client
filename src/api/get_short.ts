import type { PaginatedResponse } from '@/types'
import type { BeatmapListParams } from '@/types/beatmap/filters'
import type { BeatmapsetShort } from '@/types/beatmap/short'
import { apiClient } from './client'

export async function getBeatmaps(params?: BeatmapListParams) {
  return apiClient.get<PaginatedResponse<BeatmapsetShort>>('beatmapsets', { params })
}
