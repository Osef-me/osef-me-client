import type React from 'react'
import type { BeatmapInfoProps } from './BeatmapInfo.props'

const BeatmapInfo: React.FC<BeatmapInfoProps> = ({ beatmap, rates, className = '' }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatBPM = (bpm: number): string => {
    return `${Math.round(bpm)} BPM`
  }

  if (!beatmap) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-base-content/70">Beatmap non sélectionnée</h2>
        </div>
        {rates && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-base-content/70">Durée</div>
              <div className="text-lg font-semibold text-base-content">
                {formatTime(rates.drain_time)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-base-content/70">Total</div>
              <div className="text-lg font-semibold text-base-content">
                {formatTime(rates.total_time)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-base-content/70">BPM</div>
              <div className="text-lg font-semibold text-base-content">{formatBPM(rates.bpm)}</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-base-content/70">Centirate</div>
              <div className="text-lg font-semibold text-base-content">
                {(rates.centirate / 100).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-base-content">{beatmap.name}</h2>
      </div>

      {rates && (
        <div className="space-y-4">
          {/* Stats row */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-base-content/70">Drain Time</div>
              <div className="font-semibold text-base-content">{formatTime(rates.drain_time)}</div>
            </div>

            <div className="text-center">
              <div className="text-base-content/70">Total Time</div>
              <div className="font-semibold text-base-content">{formatTime(rates.total_time)}</div>
            </div>

            <div className="text-center">
              <div className="text-base-content/70">BPM</div>
              <div className="font-semibold text-base-content">{formatBPM(rates.bpm)}</div>
            </div>
          </div>

          {/* Progress bars */}
          {beatmap && (
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-base-content/70 mb-1">
                  <span>HP</span>
                  <span>{beatmap.hp || 0}/10</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((beatmap.hp || 0) / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-base-content/70 mb-1">
                  <span>OD</span>
                  <span>{beatmap.od || 0}/10</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((beatmap.od || 0) / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BeatmapInfo
