import type React from 'react'
import { MdDownload } from 'react-icons/md'
import { useDownload } from '@/hooks/useDownload'

const Download = MdDownload

export type BeatmapActionsProps = {
  beatmapsetId?: number
  beatmapsetName?: string
  creator?: string
  className?: string
}

const BeatmapActions: React.FC<BeatmapActionsProps> = ({ 
  beatmapsetId, 
  beatmapsetName, 
  creator, 
  className 
}) => {
  const { downloadBeatmap } = useDownload()

  return (
    <div
      className={`absolute top-0 right-0 h-full w-12 bg-base-200/90 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-10 flex items-center justify-center ${className || ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={async (e) => {
          e.stopPropagation()
          console.log(`🔘 Download button clicked for beatmap ${beatmapsetId}`)
          console.log('🎯 Calling downloadBeatmap function...')
          await downloadBeatmap(beatmapsetId, beatmapsetName, creator)
          console.log('✅ downloadBeatmap function completed')
        }}
        className="text-white hover:text-primary-content transition-colors"
        title="Download beatmapset"
      >
        <Download size={20} />
      </button>
    </div>
  )
}

export default BeatmapActions
