import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BeatmapDetail } from '@/components/organisms'
import { useBeatmapNavigation } from '@/hooks/beatmap/useBeatmapNavigation'
import { useBeatmapset } from '@/hooks/beatmap/useBeatmapset'
import { useRates } from '@/hooks/beatmap/useRates'
import { useNpsData } from '@/hooks/beatmap/useNpsData'
import type { BeatmapInfo } from '@/types/beatmap/detail'

const RemoteBeatmapDetail: React.FC = () => {
  const { beatmapsetOsuId, beatmapOsuId } = useParams<{
    beatmapsetOsuId: string
    beatmapOsuId: string
  }>()

  const navigate = useNavigate()
  const [centirate, setCentirate] = useState(100)
  const [ratingType, setRatingType] = useState('overall')

  // Hooks
  const {
    beatmapset,
    loading: beatmapsetLoading,
    error: beatmapsetError,
  } = useBeatmapset(beatmapsetOsuId ? parseInt(beatmapsetOsuId, 10) : undefined)

  const {
    rates,
    loading: ratesLoading,
    error: ratesError,
  } = useRates(beatmapOsuId ? parseInt(beatmapOsuId, 10) : undefined, centirate)

  const { npsData } = useNpsData()

  const { currentBeatmap, navigateToBeatmap } = useBeatmapNavigation(
    beatmapset,
    beatmapOsuId ? parseInt(beatmapOsuId, 10) : undefined,
    {
      onBeatmapChange: (beatmap) => {
        navigate(`/beatmapsets/${beatmapsetOsuId}/${beatmap.beatmap_osu_id}`)
      },
    }
  )

  // No fallback: rely solely on 'nps-calculated' event

  const handleBeatmapChange = useCallback(
    (beatmap: BeatmapInfo) => {
      navigateToBeatmap(beatmap.beatmap_osu_id)
    },
    [navigateToBeatmap]
  )

  // Effect to redirect to first beatmap if no specific beatmap is selected
  useEffect(() => {
    if (beatmapset && !beatmapOsuId && beatmapset.beatmaps.length > 0) {
      const firstBeatmap = beatmapset.beatmaps[0]
      navigate(`/beatmapsets/${beatmapsetOsuId}/${firstBeatmap?.beatmap_osu_id}`, { replace: true })
    }
  }, [beatmapset, beatmapOsuId, beatmapsetOsuId, navigate])

  // Error handling
  if (beatmapsetError) {
    return (
      <div className="alert alert-error">
        <span>Erreur lors du chargement du beatmapset: {beatmapsetError.message}</span>
      </div>
    )
  }

  if (beatmapsetLoading || !beatmapset) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!currentBeatmap) {
    return (
      <div className="alert alert-warning">
        <span>Beatmap introuvable</span>
      </div>
    )
  }

  return (
    <BeatmapDetail
      beatmapset={beatmapset}
      selectedBeatmap={currentBeatmap}
      rates={rates}
      ratesLoading={ratesLoading}
      ratesError={ratesError}
      onBeatmapChange={handleBeatmapChange}
      centirate={centirate}
      onCentirateChange={setCentirate}
      ratingType={ratingType}
      onRatingTypeChange={setRatingType}
      showEditButton={false}
      npsData={npsData}
    />
  )
}

export default RemoteBeatmapDetail
