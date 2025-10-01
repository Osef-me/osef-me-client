import type React from 'react'

export type BeatmapCardInfoProps = {
  artist: string
  title: string
  creator: string
  className?: string
}

const BeatmapCardInfo: React.FC<BeatmapCardInfoProps> = ({ artist, title, creator, className }) => {
  return (
    <div className={`flex-1 flex flex-col justify-center mt-2 ${className || ''}`}>
      <h3 className="text-lg font-bold mb-1 line-clamp-1">
        {artist || 'Unknown Artist'} - {title || 'Unknown Title'}
      </h3>
      <p className="text-xs text-base-content/80">by {creator || 'Unknown Creator'}</p>
    </div>
  )
}

export default BeatmapCardInfo
