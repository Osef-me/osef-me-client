import type React from 'react'
import { createContext, useContext, useState } from 'react'
import { RemoteBeatmapDetail } from '@/components/organisms'

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
        <RemoteBeatmapDetail />
      </BeatmapDetailContext.Provider>
    </div>
  )
}

export default BeatmapDetailPage
