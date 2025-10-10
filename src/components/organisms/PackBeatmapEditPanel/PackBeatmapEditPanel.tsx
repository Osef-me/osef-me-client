import React, { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Button, Input } from '@/components/atoms'
import { SideMenu } from '@/components/molecules'

interface PackBeatmapEditPanelProps {
  isOpen: boolean
  onClose: () => void
  beatmapIndex: number
  onBeatmapUpdated: () => void
}

const PackBeatmapEditPanel: React.FC<PackBeatmapEditPanelProps> = ({
  isOpen,
  onClose,
  beatmapIndex,
  onBeatmapUpdated,
}) => {
  const [versionName, setVersionName] = useState('')
  const [od, setOd] = useState(8)
  const [hp, setHp] = useState(8)
  const [targetRate, setTargetRate] = useState(1.0)
  const [lnMode, setLnMode] = useState<'none' | 'noln' | 'fullln'>('none')
  const [lnGapMs, setLnGapMs] = useState(75)
  const [lnMinDistanceMs, setLnMinDistanceMs] = useState(40)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApply = async () => {
    try {
      setLoading(true)
      setError(null)

      const modifications = {
        od: od !== 8 ? od : null,
        hp: hp !== 8 ? hp : null,
        target_rate: targetRate !== 1.0 ? targetRate : null,
        ln_mode: lnMode !== 'none' ? lnMode : null,
        ln_gap_ms: lnMode === 'fullln' ? lnGapMs : null,
        ln_min_distance_ms: lnMode === 'fullln' ? lnMinDistanceMs : null,
        version_name: versionName || null,
      }

      await invoke('update_pack_beatmap_cmd', {
        index: beatmapIndex,
        modifications,
      })

      onBeatmapUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SideMenu
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Beatmap"
      width="500px"
    >
      <div className="space-y-4">
        {/* Version Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Difficulty Name</span>
          </label>
          <Input
            type="text"
            value={versionName}
            onChange={setVersionName}
            placeholder="Enter new difficulty name"
            className="w-full"
          />
        </div>

        {/* OD */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">OD (Overall Difficulty)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={od}
              onChange={(e) => setOd(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-sm">{od.toFixed(1)}</span>
          </div>
        </div>

        {/* HP */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">HP (HP Drain)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={hp}
              onChange={(e) => setHp(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-sm">{hp.toFixed(1)}</span>
          </div>
        </div>

        {/* Rate */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Rate</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={targetRate}
              onChange={(e) => setTargetRate(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-sm">{targetRate.toFixed(2)}x</span>
          </div>
        </div>

        {/* LN Mode */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">LN Mode</span>
          </label>
          <select
            value={lnMode}
            onChange={(e) => setLnMode(e.target.value as 'none' | 'noln' | 'fullln')}
            className="select select-bordered w-full"
          >
            <option value="none">None</option>
            <option value="noln">Remove LNs</option>
            <option value="fullln">Full LN</option>
          </select>
        </div>

        {/* Full LN Options */}
        {lnMode === 'fullln' && (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text">LN Gap (ms)</span>
              </label>
              <Input
                type="number"
                value={lnGapMs.toString()}
                onChange={(value) => setLnGapMs(parseInt(value, 10))}
                placeholder="75"
                className="w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Min LN Distance (ms)</span>
              </label>
              <Input
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
    </SideMenu>
  )
}

export default PackBeatmapEditPanel
