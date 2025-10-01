import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BeatmapDetail } from '@/components/organisms'
import { useBeatmapNavigation } from '@/hooks/beatmap/useBeatmapNavigation'
import { useBeatmapset } from '@/hooks/beatmap/useBeatmapset'
import { useRates } from '@/hooks/beatmap/useRates'
import type { BeatmapInfo } from '@/types/beatmap/detail'

// Context for beatmap detail page state
interface BeatmapDetailContextType {
  centirate: number
  setCentirate: (value: number) => void
  ratingType: string
  setRatingType: (value: string) => void
}

const BeatmapDetailContext = createContext<BeatmapDetailContextType | null>(null)

export const useBeatmapDetailContext = () => {
  const context = useContext(BeatmapDetailContext)
  if (!context) {
    throw new Error('useBeatmapDetailContext must be used within BeatmapDetailProvider')
  }
  return context
}

const BeatmapDetailPageContent: React.FC = () => {
  const { beatmapsetOsuId, beatmapOsuId } = useParams<{
    beatmapsetOsuId: string
    beatmapOsuId: string
  }>()

  const navigate = useNavigate()
  const { centirate, setCentirate, ratingType, setRatingType } = useBeatmapDetailContext()

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

  const { currentBeatmap, navigateToBeatmap } = useBeatmapNavigation(
    beatmapset,
    beatmapOsuId ? parseInt(beatmapOsuId, 10) : undefined,
    {
      onBeatmapChange: (beatmap) => {
        navigate(`/beatmapsets/${beatmapsetOsuId}/${beatmap.beatmap_osu_id}`)
      },
    }
  )

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
    />
  )
}

const BeatmapDetailPage: React.FC = () => {
  const [centirate, setCentirate] = useState(100)
  const [ratingType, setRatingType] = useState('overall')

  return (
    <div className="max-w-7xl mx-auto">
      <BeatmapDetailContext.Provider
        value={{
          centirate,
          setCentirate,
          ratingType,
          setRatingType,
        }}
      >
        <BeatmapDetailPageContent />
      </BeatmapDetailContext.Provider>
    </div>
  )
}

export default BeatmapDetailPage
