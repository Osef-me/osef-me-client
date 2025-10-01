// Short beatmapset types matching the GET /beatmaps API

export type BeatmapRatingShort = {
  rating: number
  rating_type: string // e.g. 'etterna' | 'sunnyxxy' | 'osu'
}

export type BeatmapShort = {
  osu_id: number
  difficulty: string // e.g. "[4K] Hard"
  mode: number // 3 for osu!mania
  status: string // 'ranked' | 'graveyard' | etc.
  main_pattern: string[]
  ratings: BeatmapRatingShort[]
}

export type BeatmapsetShort = {
  osu_id: number
  artist: string
  title: string
  creator: string
  cover_url: string
  total_beatmaps: number
  beatmaps: BeatmapShort[]
}
