import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useTauriEvents } from '@/context/TauriEventProvider'
import { NpsGraph } from '@/components/atoms/display/NpsGraph'
import { Button } from '@/components/atoms'
import type { Beatmapset } from '@/types/beatmap/detail'

interface PackMetadata {
  name: string
  author: string
  creator: string
}

interface BeatmapData {
  beatmap: Beatmapset
  rm_beatmap?: string | null
}

const PackMakerPage: React.FC = () => {
  const { currentBeatmapset, currentNpsData, connectionStatus } = useTauriEvents()
  const [packMetadata, setPackMetadata] = useState<PackMetadata>({ name: '', author: '', creator: '' })
  const [packBeatmaps, setPackBeatmaps] = useState<BeatmapData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPack = useCallback(async () => {
    try {
      setError(null)
      const result = await invoke<[PackMetadata, BeatmapData[]]>('get_pack')
      if (result) {
        setPackMetadata(result[0])
        setPackBeatmaps(result[1] || [])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => {
    loadPack()
  }, [loadPack])

  const handleAddToPack = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await invoke('add_to_pack')
      await loadPack()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [loadPack])

  const npsData = currentNpsData

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {!connectionStatus.connected && (
        <div className="alert alert-warning">
          <span>{connectionStatus.error || 'Disconnected from osu!'}</span>
        </div>
      )}

      <div className="bg-base-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pack Maker</h1>
          <Button onClick={handleAddToPack} disabled={loading || !currentBeatmapset} color="primary" style="outline">
            {loading ? 'Adding...' : 'Add to Pack'}
          </Button>
        </div>
        <div className="mt-4">
          {npsData && Array.isArray(npsData.nps_graph) && npsData.nps_graph.length > 0 ? (
            <NpsGraph npsData={npsData.nps_graph} />
          ) : (
            <div className="text-base-content/60">No NPS data</div>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="bg-base-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Pack Metadata</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text">Name</span></label>
            <input className="input input-bordered" value={packMetadata.name} onChange={(e) => setPackMetadata({ ...packMetadata, name: e.target.value })} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Author</span></label>
            <input className="input input-bordered" value={packMetadata.author} onChange={(e) => setPackMetadata({ ...packMetadata, author: e.target.value })} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Creator</span></label>
            <input className="input input-bordered" value={packMetadata.creator} onChange={(e) => setPackMetadata({ ...packMetadata, creator: e.target.value })} />
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={async () => { await invoke('update_pack_metadata', { metadata: packMetadata }); loadPack() }} style="outline">Save Metadata</Button>
        </div>
      </div>

      <div className="bg-base-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Beatmaps in Pack</h2>
        {packBeatmaps.length === 0 ? (
          <div className="text-base-content/60">No beatmaps yet</div>
        ) : (
          <div className="space-y-3">
            {packBeatmaps.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-base-100 rounded p-3">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{item.beatmap.title}</div>
                  <div className="text-sm text-base-content/60">by {item.beatmap.artist}</div>
                  <div className="text-sm text-base-content/60">[{item.beatmap.beatmaps?.[0]?.name || '—'}]</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button style="ghost">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PackMakerPage
