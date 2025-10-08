import type React from 'react'
import { useCallback } from 'react'
import { BeatmapDetail } from '@/components/organisms'
import { useCurrentBeatmapContext } from '@/components/pages/CurrentPage/CurrentPage'
import { useTauriEvents } from '@/context/TauriEventProvider'
import type { BeatmapInfo } from '@/types/beatmap/detail'


const CurrentBeatmapDetail: React.FC = () => {

  // Handle reconnection
  const { reconnect } = useCurrentBeatmapContext()

  // Get data from global Tauri event provider
  const {
    currentBeatmapset: beatmapset,
    getCurrentRateForCentirate,
    currentNpsData,
  } = useTauriEvents()

  // Extract NPS data for passing to components
  const npsData = currentNpsData

  // Get UI state from CurrentPage context
  const {
    centirate,
    setCentirate,
    ratingType,
    setRatingType,
  } = useCurrentBeatmapContext()

  // Get the first beatmap directly instead of trying to find it
  const currentBeatmap = beatmapset?.beatmaps?.[0] || null

  // Find the rate that matches the current centirate
  console.log('CurrentBeatmapDetail - getting rate for centirate:', centirate)
  const rates = getCurrentRateForCentirate(centirate)
  console.log('CurrentBeatmapDetail - selected rates:', rates)

  // Navigation logic (simplified since we're not navigating)
  const navigateToBeatmap = (beatmapId: number) => {
    console.log('Navigate to beatmap:', beatmapId)
  }

  const handleBeatmapChange = useCallback(
    (beatmap: BeatmapInfo) => {
      navigateToBeatmap(beatmap.beatmap_osu_id)
    },
    [navigateToBeatmap]
  )

  // Get connection status from global provider
  const { connectionStatus } = useTauriEvents()

  // No beatmap currently playing
  if (!beatmapset) {
    // If we have an explicit connection error (not just initial disconnected state), show reconnect UI
    if (connectionStatus.error && connectionStatus.error !== "Please start osu! to see beatmaps here") {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-base-content">osu! connection lost</h2>
          <p className="text-base-content/70">
            {connectionStatus.error}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={reconnect}
            disabled={connectionStatus.error === 'Reconnecting...'}
          >
            {connectionStatus.error === 'Reconnecting...' ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Reconnecting...
              </>
            ) : (
              'Retry Connection'
            )}
          </button>
          <p className="text-sm text-base-content/50 mt-2">
            Make sure osu! is running and try again
          </p>
        </div>
      )
    }

    // Default case: no beatmap but no connection error (initial state or osu! not playing anything)
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="text-6xl">🎵</div>
        <h2 className="text-2xl font-bold text-base-content">No beatmap currently playing</h2>
        <p className="text-base-content/70">Open a beatmap in osu! to see it here</p>
      </div>
    )
  }

  // Loading state
  if (!beatmapset) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!currentBeatmap) {
    return (
      <div className="alert alert-warning">
        <span>Beatmap not found</span>
      </div>
    )
  }

  return (
    <BeatmapDetail
      beatmapset={beatmapset}
      selectedBeatmap={currentBeatmap}
      rates={rates}
      onBeatmapChange={handleBeatmapChange}
      centirate={centirate}
      onCentirateChange={setCentirate}
      ratingType={ratingType}
      onRatingTypeChange={setRatingType}
      showDownloadButton={false}
      showEditButton={true}
      npsData={npsData}
    />
  )
}

export default CurrentBeatmapDetail
