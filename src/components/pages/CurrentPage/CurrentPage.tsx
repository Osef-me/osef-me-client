import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CurrentBeatmapDetail } from '@/components/organisms'

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

  // Listen for connection status events from backend (only in Tauri environment)
  useEffect(() => {
    // Check if we're in Tauri environment
    if (typeof window !== 'undefined' && window.__TAURI__) {
      const unlisten = listen('connection-status', (event) => {
        const status: ConnectionStatus = event.payload as ConnectionStatus
        setConnectionStatus(status)
      })

      return () => {
        unlisten.then(fn => fn())
      }
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
          setConnectionStatus,
          reconnect,
        }}
      >
        <CurrentBeatmapDetail />
      </CurrentBeatmapContext.Provider>
    </div>
  )
}

export default CurrentPage
