import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { ManiaRadarChart, RatingValue } from '@/components/atoms'
import { NpsGraph } from '@/components/atoms/display/NpsGraph'
import { Button } from '@/components/atoms'
import { RatingControls } from '@/components/molecules'
import { BeatmapEditPanel } from '@/components/organisms/BeatmapEditPanel'
import type { RatingSectionProps } from './RatingSection.props'

const RatingSection: FC<RatingSectionProps> = ({
  rates,
  loading = false,
  error,
  centirate,
  onCentirateChange,
  ratingType,
  onRatingTypeChange,
  showEditButton = true,
  npsData: externalNpsData,
  className = '',
}) => {
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false)

  // Use external NPS data if provided, otherwise default to null
  const npsData = externalNpsData || null

  const findBestRating = (requestedType: string) => {
    const ratings = rates?.rating || []
    const defaultTypes = ['etterna', 'osu', 'overall']

    // Try exact match first
    const exact = ratings.find((r) => r.rating_type === requestedType)
    if (exact) return { rating: exact, type: requestedType }

    // Try default types
    for (const type of defaultTypes) {
      if (type !== requestedType) {
        const fallback = ratings.find((r) => r.rating_type === type)
        if (fallback) return { rating: fallback, type }
      }
    }

    return { rating: ratings[0], type: ratings[0]?.rating_type || requestedType }
  }

  const getRatingValue = (ratingType: string): number | null => {
    return findBestRating(ratingType).rating?.rating || null
  }

  const getManiaRatings = () => {
    // Find the rating that matches the current ratingType
    const currentRating = rates?.rating?.find((r) => r.rating_type === ratingType)
    if (
      currentRating?.mode_rating &&
      typeof currentRating.mode_rating === 'object' &&
      'Mania' in currentRating.mode_rating
    ) {
      return currentRating.mode_rating.Mania
    }

    // If the current rating type doesn't have Mania details, try to find any rating that has them
    const maniaRating = rates?.rating?.find(
      (r) => r.mode_rating && typeof r.mode_rating === 'object' && 'Mania' in r.mode_rating
    )
    if (
      maniaRating?.mode_rating &&
      typeof maniaRating.mode_rating === 'object' &&
      'Mania' in maniaRating.mode_rating
    ) {
      return maniaRating.mode_rating.Mania
    }
    return null
  }

  // Compute base BPM (BPM at 1.0x) from current rates if available
  const baseBpm = useMemo(() => {
    if (!rates) return null
    const rateFactor = rates.centirate / 100
    if (rateFactor <= 0) return null
    return rates.bpm / rateFactor
  }, [rates])

  if (error) {
    return (
      <div className={`alert alert-error ${className}`}>
        <span>Erreur lors du chargement des données de rating: {error.message}</span>
      </div>
    )
  }

  if (loading && !rates) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  const ratingValue = getRatingValue(ratingType)
  const maniaRatings = getManiaRatings()

  return (
    <div className={`space-y-6 ${className}`}>
      <RatingControls
        centirate={centirate}
        onCentirateChange={onCentirateChange}
        ratingType={ratingType}
        onRatingTypeChange={onRatingTypeChange}
      />

      {loading && !rates ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : rates ? (
        ratingValue !== null ? (
          <div className="text-center">
            <RatingValue
              value={ratingValue}
              label={findBestRating(ratingType).type}
              className="text-4xl"
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/70">Aucun rating disponible pour cette beatmap</p>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <p className="text-base-content/70">Données de rating non chargées</p>
        </div>
      )}

      <div className="mt-6 flex flex-col lg:flex-row gap-6 mb-6">
        {maniaRatings && !loading && (
          <div className="flex-1">
            <ManiaRadarChart maniaRating={maniaRatings} overallRating={ratingValue} />
          </div>
        )}

        {npsData && Array.isArray(npsData.nps_graph) && npsData.nps_graph.length > 0 && (
          <div className="flex-1">
            <NpsGraph npsData={npsData.nps_graph} />
            <div className="mt-4 flex justify-center">
              {showEditButton && (
                <Button
                  onClick={() => setIsEditPanelOpen(true)}
                  color="primary"
                  style="outline"
                >
                  Edit Beatmap
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <BeatmapEditPanel
        isOpen={isEditPanelOpen}
        onClose={() => setIsEditPanelOpen(false)}
        initialOd={rates?.rating[0]?.rating}
        initialHp={rates?.rating[0]?.rating}
        centirate={centirate}
        onCentirateChange={onCentirateChange}
        baseBpm={baseBpm}
      />
    </div>
  )
}

export default RatingSection
