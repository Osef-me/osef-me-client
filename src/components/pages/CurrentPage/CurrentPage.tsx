import type React from 'react'
import { createContext, useCallback, useContext, useState, useEffect } from 'react'
import { BeatmapDetail } from '@/components/organisms'
import { useCurrentBeatmap } from '@/hooks/beatmap/useCurrentBeatmap'
import { useBeatmapNavigation } from '@/hooks/beatmap/useBeatmapNavigation'
import { useCurrentRates } from '@/hooks/beatmap/useCurrentRates'
import type { BeatmapInfo } from '@/types/beatmap/detail'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

// Connection status interface
interface ConnectionStatus {
  connected: boolean
  error?: string
}

// Context for current beatmap page state
interface CurrentBeatmapContextType {
  centirate: number
  setCentirate: (value: number) => void
  ratingType: string
  setRatingType: (value: string) => void
  connectionStatus: ConnectionStatus
  setConnectionStatus: (status: ConnectionStatus) => void
  reconnect: () => Promise<void>
}

const CurrentBeatmapContext = createContext<CurrentBeatmapContextType | null>(null)

export const useCurrentBeatmapContext = () => {
  const context = useContext(CurrentBeatmapContext)
  if (!context) {
    throw new Error('useCurrentBeatmapContext must be used within CurrentBeatmapProvider')
  }
  return context
}

const CurrentPageContent: React.FC = () => {
  const { centirate, setCentirate, ratingType, setRatingType, connectionStatus, reconnect } = useCurrentBeatmapContext()

  // Hooks
  const {
    beatmapset,
    loading: beatmapsetLoading,
    error: beatmapsetError,
  } = useCurrentBeatmap()

  // Get the first beatmap directly instead of trying to find it
  const currentBeatmap = beatmapset?.beatmaps?.[0] || null

  const { navigateToBeatmap } = useBeatmapNavigation(
    beatmapset,
    currentBeatmap?.beatmap_osu_id,
    {
      onBeatmapChange: () => {
        // Pas de navigation dans Current page, juste changement local
      },
    }
  )

  const {
    rates,
    loading: ratesLoading,
    error: ratesError,
  } = useCurrentRates(currentBeatmap?.beatmap_osu_id, centirate)

  const handleBeatmapChange = useCallback(
    (beatmap: BeatmapInfo) => {
      navigateToBeatmap(beatmap.beatmap_osu_id)
    },
    [navigateToBeatmap]
  )

  // Connection error - show reconnection UI
  if (!connectionStatus.connected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-base-content">Connection Lost</h2>
        <p className="text-base-content/70">
          {connectionStatus.error || "Unable to connect to osu!"}
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

  // Connection error - show reconnection UI
  if (!connectionStatus.connected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-base-content">osu! is not running</h2>
        <p className="text-base-content/70">
          {connectionStatus.error || "Please start osu! to see beatmaps here"}
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

  // No beatmap currently playing
  if (!beatmapsetLoading && !beatmapset) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="text-6xl">🎵</div>
        <h2 className="text-2xl font-bold text-base-content">No beatmap currently playing</h2>
        <p className="text-base-content/70">Open a beatmap in osu! to see it here</p>
      </div>
    )
  }

  // Error handling
  if (beatmapsetError) {
    return (
      <div className="alert alert-error">
        <span>Error loading current beatmap: {beatmapsetError.message}</span>
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
        <span>Beatmap not found</span>
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
      showDownloadButton={false}
    />
  )
}

const CurrentPage: React.FC = () => {
  const [centirate, setCentirate] = useState(100)
  const [ratingType, setRatingType] = useState('overall')
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    error: undefined
  })

  // Handle reconnection
  const reconnect = useCallback(async () => {
    try {
      setConnectionStatus({ connected: false, error: 'Reconnecting...' })
      await invoke('restart_osu_connection')
      // The connection status will be updated via the event listener
    } catch (error) {
      console.error('Failed to restart connection:', error)
      setConnectionStatus({
        connected: false,
        error: error instanceof Error ? error.message : 'Failed to reconnect'
      })
    }
  }, [])

  // Listen for connection status events from backend
  useEffect(() => {
    const unlisten = listen('connection-status', (event) => {
      const status: ConnectionStatus = event.payload as ConnectionStatus
      setConnectionStatus(status)
    })

    return () => {
      unlisten.then(fn => fn())
    }
  }, [])

  // TODO: Réactiver la démo de beatmaps plus tard si nécessaire
  // Pour l'instant, désactivé car pas nécessaire

  return (
    <div className="max-w-7xl mx-auto">
      <CurrentBeatmapContext.Provider
        value={{
          centirate,
          setCentirate,
          ratingType,
          setRatingType,
          connectionStatus,
          setConnectionStatus,
          reconnect,
        }}
      >
        <CurrentPageContent />
      </CurrentBeatmapContext.Provider>
    </div>
  )
}

export default CurrentPage
