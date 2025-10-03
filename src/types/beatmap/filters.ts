// Reusable query params for beatmap list/search endpoints, organized like the Rust structs

export type RatingFilter = {
  rating_type?: string
  rating_min?: number | null
  rating_max?: number
}

export type SkillsetType =
  | 'stream'
  | 'jumpstream'
  | 'handstream'
  | 'stamina'
  | 'jackspeed'
  | 'chordjack'
  | 'technical'
  | 'hybrid'
  | 'ln'

export type SkillsetFilter = {
  pattern_type?: SkillsetType
  pattern_min?: number | null
  pattern_max?: number
}

export type BeatmapFilter = {
  search_term?: string
  total_time_min?: number // ms
  total_time_max?: number // ms
  bpm_min?: number
  bpm_max?: number
}

export type BeatmapTechnicalFilter = {
  od_min?: number
  od_max?: number
  status?: string // 'pending' | 'ranked' | 'qualified' | 'loved' | 'graveyard'
}

export type RatesFilter = {
  drain_time_min?: number // seconds
  drain_time_max?: number // seconds
}

export type BeatmapListParams = {
  rating?: RatingFilter
  skillset?: SkillsetFilter
  beatmap?: BeatmapFilter
  beatmap_technical?: BeatmapTechnicalFilter
  rates?: RatesFilter
  random?: boolean
  page?: number // 0-based
  per_page?: number
}
