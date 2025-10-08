import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import type { Beatmapset, Rates, NpsData } from '@/types/beatmap/detail'

interface ConnectionStatus {
  connected: boolean
  error?: string
}

interface TauriEventState {
  currentBeatmapset: Beatmapset | null
  currentRates: Rates[]
  currentNpsData: NpsData | null
  connectionStatus: ConnectionStatus
}

interface TauriEventContextType extends TauriEventState {
  // Helper functions
  getCurrentRateForCentirate: (centirate: number) => Rates | null
}

const TauriEventContext = React.createContext<TauriEventContextType | null>(null)

export const useTauriEvents = () => {
  const context = React.useContext(TauriEventContext)
  if (!context) {
    throw new Error('useTauriEvents must be used within TauriEventProvider')
  }
  return context
}

export const TauriEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBeatmapset, setCurrentBeatmapset] = useState<Beatmapset | null>(null)
  const [currentRates, setCurrentRates] = useState<Rates[]>([])
  const [currentNpsData, setCurrentNpsData] = useState<NpsData | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    error: undefined
  })

  useEffect(() => {
    const unsubscribers: Array<() => void> = []

    console.log('🔌 TauriEventProvider mounting...')

    try {
      // Listen for beatmap changes
      const unlistenBeatmap = listen<Beatmapset>('beatmap-changed', (event) => {
        console.log('🎵 Global received beatmap-changed:', event.payload.title)
        setCurrentBeatmapset(event.payload)
      })
      unlistenBeatmap.then(fn => unsubscribers.push(fn))

      // Listen for rates
      const unlistenRates = listen<Rates[]>('rates-calculated', (event) => {
        console.log('📊 Global received rates-calculated:', event.payload.length, 'rates')
        setCurrentRates(event.payload)
      })
      unlistenRates.then(fn => unsubscribers.push(fn))

      // Listen for NPS data
      const unlistenNps = listen<NpsData>('nps-calculated', (event) => {
        console.log('📈 Global received nps-calculated:', {
          points: event.payload.nps_graph.length,
          drain_time: event.payload.drain_time
        })
        setCurrentNpsData(event.payload)
      })
      unlistenNps.then(fn => unsubscribers.push(fn))

      // Listen for connection status
      const unlistenConnection = listen<ConnectionStatus>('connection-status', (event) => {
        console.log('🔗 Global received connection-status:', event.payload.connected ? 'Connected' : 'Disconnected')
        setConnectionStatus(event.payload)
      })
      unlistenConnection.then(fn => unsubscribers.push(fn))
    } catch (error) {
      console.error('❌ Failed to setup Tauri event listeners:', error)
    }

    return () => {
      console.log('🧹 Cleaning up Tauri event listeners...')
      unsubscribers.forEach(fn => fn())
    }
  }, [])

  const getCurrentRateForCentirate = (centirate: number): Rates | null => {
    if (currentRates.length === 0) return null

    return currentRates.reduce((prev, curr) => {
      return Math.abs(curr.centirate - centirate) < Math.abs(prev.centirate - centirate)
        ? curr
        : prev
    })
  }

  const value = useMemo(() => ({
    currentBeatmapset,
    currentRates,
    currentNpsData,
    connectionStatus,
    getCurrentRateForCentirate,
  }), [currentBeatmapset, currentRates, currentNpsData, connectionStatus])

  return (
    <TauriEventContext.Provider value={value}>
      {children}
    </TauriEventContext.Provider>
  )
}
