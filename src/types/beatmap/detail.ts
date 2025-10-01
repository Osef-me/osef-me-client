// Types pour les détails des beatmaps
// Correspond aux interfaces du backend pour les routes détaillées

export interface Beatmapset {
  id: number
  osu_id?: number
  artist: string
  artist_unicode?: string
  title: string
  title_unicode?: string
  creator: string
  source?: string
  tags?: string[]
  has_video: boolean
  has_storyboard: boolean
  is_explicit: boolean
  is_featured: boolean
  cover_url?: string
  preview_url?: string
  osu_file_url?: string
  beatmaps: BeatmapInfo[]
}

export interface BeatmapInfo {
  beatmap_osu_id: number
  name: string // difficulté
  count_circles: number
  count_sliders: number
  count_spinners: number
  od: number
  hp: number
  ratings: RatingInfo[]
}

export interface RatingInfo {
  rating_type: string
  rating_value: number
}

export interface Rates {
  id?: number
  osu_hash?: string
  centirate: number
  drain_time: number // secondes
  total_time: number
  bpm: number
  rating: Rating[]
}

export interface Rating {
  id?: number
  rates_id?: number
  rating: number
  rating_type: string
  mode_rating: ModeRating
}

export type ModeRating = { Mania: ManiaRating } | 'Std' | 'Ctb' | 'Taiko'

export interface ManiaRating {
  id?: number
  stream: number
  jumpstream: number
  handstream: number
  stamina: number
  jackspeed: number
  chordjack: number
  technical: number
}

export interface BeatmapsetDetailParams {
  beatmapsetOsuId: string
  beatmapOsuId: string
}

export interface BeatmapsetRedirectParams {
  beatmapsetOsuId: string
}

export interface NpsData {
  nps_graph: number[]
  drain_time: number
}
