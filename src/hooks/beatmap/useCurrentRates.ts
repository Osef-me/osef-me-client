import { useEffect, useMemo, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core'
import type { Rates } from '@/types/beatmap/detail'

export const useCurrentRates = (beatmapOsuId: number | undefined, centirate: number) => {
  const [allRates, setAllRates] = useState<Rates[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Charger les rates existants au montage (si beatmap déjà présente)
    const loadExistingRates = async () => {
      try {
        const rates = await invoke<Rates[]>('get_all_rates')
        if (rates && rates.length > 0) {
          console.log('✅ Rates existants chargés:', rates.length, 'rates')
          setAllRates(rates)
        }
      } catch (err) {
        // Pas de rates existants, on attend l'événement
      }
    }

    loadExistingRates()

    // Écouter l'événement rates-calculated pour les futures mises à jour
    const unlisten = listen<Rates[]>('rates-calculated', (event) => {
      console.log('✅ Rates reçus du frontend:', event.payload.length, 'rates')
      setAllRates(event.payload)
      setLoading(false)
      setError(null)
    })

    // Nettoyer le listener au démontage
    return () => {
      unlisten.then((fn) => fn())
    }
  }, [])

  // Sélectionne le rate qui correspond au centirate demandé
  const rates = useMemo(() => {
    if (allRates.length === 0) return null

    // Trouve le rate le plus proche du centirate demandé
    const closestRate = allRates.reduce((prev, curr) => {
      return Math.abs(curr.centirate - centirate) < Math.abs(prev.centirate - centirate)
        ? curr
        : prev
    })

    return closestRate
  }, [allRates, centirate])

  return {
    rates,
    loading,
    error,
  }
}
