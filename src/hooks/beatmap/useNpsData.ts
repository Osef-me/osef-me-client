import { useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import type { NpsData } from '@/types/beatmap/detail'

export const useNpsData = () => {
  const [npsData, setNpsData] = useState<NpsData | null>(null)

  useEffect(() => {
    // Écouter l'événement nps-calculated
    const unlisten = listen<NpsData>('nps-calculated', (event) => {
      console.log('✅ NPS reçu du backend:', event.payload.nps_graph.length, 'sections, drain_time=', event.payload.drain_time)
      setNpsData(event.payload)
    })

    // Nettoyer le listener au démontage
    return () => {
      unlisten.then((fn) => fn())
    }
  }, [])

  return npsData
}

