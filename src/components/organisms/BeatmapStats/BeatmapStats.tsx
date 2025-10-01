import type React from 'react'
import { MdDownload, MdLinearScale, MdMusicNote } from 'react-icons/md'
import type { BeatmapInfo, Rates } from '@/types/beatmap/detail'

interface BeatmapStatsProps {
  selectedBeatmap: BeatmapInfo | null
  rates: Rates | null
  onDownload?: () => void
  beatmapsetId?: number
  showDownloadButton?: boolean
  className?: string
}

const BeatmapStats: React.FC<BeatmapStatsProps> = ({
  selectedBeatmap,
  rates,
  onDownload,
  showDownloadButton = true,
  className = '',
}) => {
  const _formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 ${className}`}>
      <div className="space-y-4">
        {/* Stats row with icons */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-white/70 mb-1">
              <MdMusicNote size={14} />
              <span>Notes</span>
            </div>
            <div className="font-semibold text-white">
              {selectedBeatmap ? selectedBeatmap.count_circles || 0 : '--'}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-white/70 mb-1">
              <MdLinearScale size={14} />
              <span>LN</span>
            </div>
            <div className="font-semibold text-white">
              {selectedBeatmap ? selectedBeatmap.count_sliders || 0 : '--'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-white/70 mb-1">BPM</div>
            <div className="font-semibold text-white">
              {selectedBeatmap && rates ? Math.round(rates.bpm) : '--'}
            </div>
          </div>
        </div>

        {/* Progress bars */}
        {selectedBeatmap && (
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>HP</span>
                <span>{selectedBeatmap.hp || 0}/10</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((selectedBeatmap.hp || 0) / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>OD</span>
                <span>{selectedBeatmap.od || 0}/10</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((selectedBeatmap.od || 0) / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Download button */}
      {showDownloadButton && (
        <button type="button" onClick={onDownload} className="w-full mt-4 btn btn-primary">
          <MdDownload size={16} className="mr-2" />
          Download
        </button>
      )}
    </div>
  )
}

export default BeatmapStats
