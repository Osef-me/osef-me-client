import type React from 'react'
import { useState, useId } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Button, SliderInput, CentirateInput, Select, Input } from '@/components/atoms'
import type { Beatmapset } from '@/types/beatmap/detail'

interface BeatmapEditPanelProps {
  isOpen: boolean
  onClose: () => void
  initialOd?: number
  initialHp?: number
}

export interface BeatmapModifications {
  od?: number
  hp?: number
  target_rate?: number
  ln_mode?: 'none' | 'noln' | 'fullln'
  ln_gap_ms?: number
  ln_min_distance_ms?: number
}

const BeatmapEditPanel: React.FC<BeatmapEditPanelProps> = ({
  isOpen,
  onClose,
  initialOd = 8,
  initialHp = 8,
}) => {
  const lnModeId = useId()
  const lnGapId = useId()
  const lnDistanceId = useId()
  
  const [od, setOd] = useState(initialOd)
  const [hp, setHp] = useState(initialHp)
  const [targetCentirate, setTargetCentirate] = useState(100) // 1.0 * 100
  const [lnMode, setLnMode] = useState<'none' | 'noln' | 'fullln'>('none')
  const [lnGapMs, setLnGapMs] = useState(75)
  const [lnMinDistanceMs, setLnMinDistanceMs] = useState(40)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApply = async () => {
    const modifications: BeatmapModifications = {
      od,
      hp,
      target_rate: targetCentirate / 100, // Convert centirate to float
      ln_mode: lnMode,
      ...(lnMode === 'fullln' && {
        ln_gap_ms: lnGapMs,
        ln_min_distance_ms: lnMinDistanceMs,
      }),
    }

    try {
      setLoading(true)
      setError(null)
      const modifiedBeatmap = await invoke<Beatmapset>('apply_beatmap_modifications', {
        modifications,
      })
      console.log('Modified beatmap:', modifiedBeatmap)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        className="fixed inset-0 bg-black/50 z-40 cursor-default"
        onClick={onClose}
        aria-label="Close panel overlay"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[500px] bg-base-200 shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-base-content">Edit Beatmap</h2>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* OD */}
            <div>
              <SliderInput
                label="OD"
                value={od}
                onChange={setOd}
                min={0}
                max={10}
                step={0.1}
              />
            </div>

            {/* HP */}
            <div>
              <SliderInput
                label="HP"
                value={hp}
                onChange={setHp}
                min={0}
                max={10}
                step={0.1}
              />
            </div>

            {/* Rate */}
            <div>
              <CentirateInput
                label="Rate"
                value={targetCentirate}
                onChange={setTargetCentirate}
                min={50}
                max={200}
                step={10}
              />
            </div>

            {/* LN Mode Section */}
            <div className="divider">LN Modifications</div>

            <div>
              <Select
                id={lnModeId}
                label="LN Mode"
                value={lnMode}
                onChange={(value) => setLnMode(value as 'none' | 'noln' | 'fullln')}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'noln', label: 'Remove LNs' },
                  { value: 'fullln', label: 'Full LN' },
                ]}
              />
            </div>

            {/* Full LN Options */}
            {lnMode === 'fullln' && (
              <>
                <div>
                  <label htmlFor={lnGapId} className="label">
                    <span className="label-text">LN Gap (ms)</span>
                  </label>
                  <Input
                    id={lnGapId}
                    type="number"
                    value={lnGapMs.toString()}
                    onChange={(value) => setLnGapMs(parseInt(value, 10))}
                    placeholder="75"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor={lnDistanceId} className="label">
                    <span className="label-text">Min LN Distance (ms)</span>
                  </label>
                  <Input
                    id={lnDistanceId}
                    type="number"
                    value={lnMinDistanceMs.toString()}
                    onChange={(value) => setLnMinDistanceMs(parseInt(value, 10))}
                    placeholder="40"
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Error Display */}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleApply}
                color="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Applying...' : 'Apply'}
              </Button>
              <Button onClick={onClose} style="outline" className="flex-1" disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BeatmapEditPanel
