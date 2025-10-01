import type React from 'react'
import { useCallback, useMemo } from 'react'
import {
  MdAutoFixHigh,
  MdDoNotDisturb,
  MdFavorite,
  MdHelpOutline,
  MdHourglassTop,
  MdPending,
  MdThumbUp,
  MdVerified,
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import type { BeatmapStatus, BeatmapStatusType } from '@/types/beatmap/status'
import type { ColorName } from '@/types/colors'
import BeatmapActions from './BeatmapActions/BeatmapActions'
import BeatmapBadges from './BeatmapBadges/BeatmapBadges'
import BeatmapCover from './BeatmapCover/BeatmapCover'
import BeatmapFooter from './BeatmapFooter/BeatmapFooter'
import BeatmapCardInfo from './BeatmapInfo/BeatmapInfo'
import type { BeatmapHorizontalCardProps } from './BHC.props'

const BeatmapHorizontalCard: React.FC<BeatmapHorizontalCardProps> = ({ beatmapset }) => {
  const navigate = useNavigate()

  const displayedMaps = useMemo(() => beatmapset.beatmaps.slice(0, 4), [beatmapset.beatmaps])
  const remainingCount = useMemo(() => {
    const shown = displayedMaps.length
    return beatmapset.total_beatmaps > shown ? beatmapset.total_beatmaps - shown : 0
  }, [beatmapset.total_beatmaps, displayedMaps.length])
  const uniquePatterns = useMemo(() => {
    const set = new Set<string>()
    for (const b of beatmapset.beatmaps) {
      for (const p of b.main_pattern) {
        set.add(p)
      }
    }
    return Array.from(set)
  }, [beatmapset.beatmaps])
  const priorityStatus = useMemo<BeatmapStatus>(() => {
    const status: BeatmapStatusType =
      (beatmapset.beatmaps[0]?.status as BeatmapStatusType) ?? 'unknown'
    const colorMap: Record<BeatmapStatusType, ColorName> = {
      ranked: 'green',
      loved: 'pink',
      graveyard: 'gray',
      approved: 'blue',
      qualified: 'purple',
      pending: 'yellow',
      wip: 'orange',
      unknown: 'gray',
    } as const
    const iconMap: Record<BeatmapStatusType, React.ReactNode> = {
      ranked: <MdThumbUp size={14} />,
      loved: <MdFavorite size={14} />,
      graveyard: <MdDoNotDisturb size={14} />,
      approved: <MdVerified size={14} />,
      qualified: <MdHourglassTop size={14} />,
      pending: <MdPending size={14} />,
      wip: <MdAutoFixHigh size={14} />,
      unknown: <MdHelpOutline size={14} />,
    }
    return { status, color: colorMap[status] || 'gray', icon: iconMap[status] }
  }, [beatmapset.beatmaps])
  const difficultyRange = useMemo(() => {
    const ratings = beatmapset.beatmaps
      .flatMap((b) => b.ratings)
      .filter((r) => typeof r.rating === 'number')
    if (ratings.length === 0) return null
    const minRating = Math.min(...ratings.map((r) => r.rating))
    const maxRating = Math.max(...ratings.map((r) => r.rating))
    return { minRating, maxRating }
  }, [beatmapset.beatmaps])

  const handleClick = useCallback(() => {
    navigate(`/beatmapsets/${beatmapset.osu_id}`)
  }, [navigate, beatmapset.osu_id])
  // download handled inside BeatmapActions via useDownload

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick]
  )

  if (!difficultyRange) return null

  return (
    <button
      type="button"
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group h-32 overflow-hidden relative w-full text-left"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <BeatmapCover
        coverUrl={beatmapset.cover_url}
        alt={`${beatmapset.artist} - ${beatmapset.title}`}
      />
      <BeatmapActions 
        beatmapsetId={beatmapset.osu_id} 
        beatmapsetName={beatmapset.title}
        creator={beatmapset.creator}
      />

      {/* Contenu */}
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        <BeatmapBadges
          displayedMaps={displayedMaps.map((b) => ({
            rating: Number(b.ratings?.[0]?.rating ?? 0),
            difficulty: b.difficulty,
          }))}
          remainingCount={remainingCount}
          uniquePatterns={uniquePatterns}
        />

        <BeatmapCardInfo
          artist={beatmapset.artist}
          title={beatmapset.title}
          creator={beatmapset.creator}
        />

        <BeatmapFooter
          priorityStatus={priorityStatus}
          minRating={difficultyRange.minRating}
          maxRating={difficultyRange.maxRating}
        />
      </div>
    </button>
  )
}

export default BeatmapHorizontalCard
