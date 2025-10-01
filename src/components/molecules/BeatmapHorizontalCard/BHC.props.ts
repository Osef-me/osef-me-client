// Types describing the Beatmap Horizontal Card API response and props
import type { PaginatedResponse } from '@/types'
import type { BeatmapsetShort } from '@/types/beatmap/short'

export type BeatmapsetListResponse = PaginatedResponse<BeatmapsetShort>

// Props for the molecule component
export type BeatmapHorizontalCardProps = {
  beatmapset: BeatmapsetShort
}
