import type React from 'react'
import Image from '@/components/atoms/display/Image/Image'

export type BeatmapCoverProps = {
  coverUrl: string
  alt?: string
  className?: string
}

const BeatmapCover: React.FC<BeatmapCoverProps> = ({ coverUrl, alt, className }) => {
  return (
    <div className={`absolute inset-0 ${className || ''}`}>
      <Image
        src={coverUrl || '/default-cover.jpg'}
        alt={alt || 'Cover'}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  )
}

export default BeatmapCover
