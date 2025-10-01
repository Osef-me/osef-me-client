import type { BeatmapListParams } from '@/types/beatmap/filters'

export type SectionKind =
  | 'rating'
  | 'skillset'
  | 'bpm'
  | 'total_time'
  | 'search_term'
  | 'technical_od'
  | 'technical_status'
  | 'drain'

export type FilterSectionProps = {
  value: BeatmapListParams
  onChange: (value: BeatmapListParams) => void
  className?: string
}
