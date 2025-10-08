import React, { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { CurrentBeatmapDetail } from '@/components/organisms'
import { useTauriEvents } from '@/context/TauriEventProvider'

// Context for current beatmap page state
interface CurrentBeatmapContextType {
  centirate: number
  setCentirate: (value: number) => void
  ratingType: string
  setRatingType: (value: string) => void
  connectionStatus: { connected: boolean; error?: string }
  reconnect: () => Promise<void>
}

const CurrentBeatmapContext = React.createContext<CurrentBeatmapContextType | null>(null)

export const useCurrentBeatmapContext = () => {
  const context = React.useContext(CurrentBeatmapContext)
  if (!context) {
    throw new Error('useCurrentBeatmapContext must be used within CurrentBeatmapProvider')
  }
  return context
}

const CurrentPage: React.FC = () => {
  const [centirate, setCentirate] = useState(100)
  const [ratingType, setRatingType] = useState('overall')

  // Get data from global Tauri event provider
  const { connectionStatus, currentRates, currentNpsData, currentBeatmapset } = useTauriEvents()

  // Handle reconnection
  const reconnect = React.useCallback(async () => {
    try {
      await invoke('restart_osu_connection')
      // The connection status will be updated via the global event listener
    } catch (error) {
      console.error('Failed to restart connection:', error)
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <CurrentBeatmapContext.Provider
        value={{
          centirate,
          setCentirate,
          ratingType,
          setRatingType,
          connectionStatus,
          reconnect,
        }}
      >
        <CurrentBeatmapDetail />
      </CurrentBeatmapContext.Provider>
    </div>
  )
}

export default CurrentPage
