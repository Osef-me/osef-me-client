import React, { useCallback, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useTauriEvents } from '@/context/TauriEventProvider'
import { Header, PackMetadataPanel, PackBeatmapEditPanel } from '@/components/organisms'
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
  cover_image?: string | null
  modifications?: {
    od?: number
    hp?: number
    target_rate?: number
    ln_mode?: string
    ln_gap_ms?: number
    ln_min_distance_ms?: number
    version_name?: string
  }
}

const PackMakerPage: React.FC = () => {
  const { currentBeatmapset, currentRates, getCurrentRateForCentirate } = useTauriEvents()
  const [packMetadata, setPackMetadata] = useState<PackMetadata>({ name: '', author: '', creator: '' })
  const [packBeatmaps, setPackBeatmaps] = useState<BeatmapData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMetadataPanelOpen, setIsMetadataPanelOpen] = useState(false)
  const [editingBeatmapIndex, setEditingBeatmapIndex] = useState<number | null>(null)

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

  const handleEditBeatmap = useCallback((index: number) => {
    setEditingBeatmapIndex(index)
  }, [])

  const handleCloseEditPanel = useCallback(() => {
    setEditingBeatmapIndex(null)
  }, [])

  // Get the appropriate rate for display (like in CurrentBeatmapDetail)
  // For Pack Maker, we use 1.0x (100 centirate) as default since we don't need dynamic rate selection
  const displayRate = getCurrentRateForCentirate(100)

  // Debug logs for rates
  console.log('PackMakerPage Debug:', {
    currentRatesLength: currentRates?.length || 0,
    displayRateRatingLength: displayRate?.rating?.length || 0,
    currentBeatmapset: currentBeatmapset?.title,
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pack Maker</h1>
          <Button onClick={handleAddToPack} disabled={loading || !currentBeatmapset} color="primary" style="outline">
            {loading ? 'Adding...' : 'Add to Pack'}
          </Button>
        </div>

        {/* Use the Header component with current beatmap data */}
        {currentBeatmapset && displayRate && (
          <Header
            beatmapset={currentBeatmapset}
            selectedBeatmap={currentBeatmapset.beatmaps?.[0] || null}
            rates={displayRate}
            ratingType="overall"
          />
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="bg-base-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pack Metadata</h2>
          <Button
            onClick={() => setIsMetadataPanelOpen(true)}
            color="primary"
            style="outline"
          >
            Edit Metadata
          </Button>
        </div>
      </div>

      <div className="bg-base-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Beatmaps in Pack</h2>
          <span className="text-sm text-base-content/60">{packBeatmaps.length} maps</span>
        </div>
        {packBeatmaps.length === 0 ? (
          <div className="text-base-content/60">No beatmaps yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {packBeatmaps.map((item, index) => (
              <div
                key={item.beatmap.osu_id}
                className="relative overflow-hidden rounded-lg bg-base-100"
                style={{
                  backgroundImage: item.cover_image ? `url(${item.cover_image})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '80px',
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 p-4 flex items-center justify-between text-white">
                  <div className="flex-1">
                    <div className="font-medium">{item.beatmap.title}</div>
                    <div className="text-sm text-white/80">by {item.beatmap.artist}</div>
                    <div className="text-sm text-white/60">[{item.beatmap.beatmaps?.[0]?.name || '—'}]</div>
                    {/* Affichage des modifications en cours */}
                    {item.modifications && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.modifications.od !== undefined && (
                          <span className="px-2 py-1 bg-blue-500/80 text-xs rounded">OD: {item.modifications.od}</span>
                        )}
                        {item.modifications.hp !== undefined && (
                          <span className="px-2 py-1 bg-green-500/80 text-xs rounded">HP: {item.modifications.hp}</span>
                        )}
                        {item.modifications.target_rate !== undefined && (
                          <span className="px-2 py-1 bg-purple-500/80 text-xs rounded">Rate: {item.modifications.target_rate}x</span>
                        )}
                        {item.modifications.ln_mode && (
                          <span className="px-2 py-1 bg-orange-500/80 text-xs rounded">
                            {item.modifications.ln_mode === 'fullln' ? 'FullLN' : 
                             item.modifications.ln_mode === 'noln' ? 'NoLN' : 
                             item.modifications.ln_mode}
                          </span>
                        )}
                        {item.modifications.version_name && (
                          <span className="px-2 py-1 bg-yellow-500/80 text-xs rounded">Name: {item.modifications.version_name}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button style="ghost" className="text-white hover:bg-white/20" onClick={() => handleEditBeatmap(index)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pack Metadata Panel */}
      <PackMetadataPanel
        isOpen={isMetadataPanelOpen}
        onClose={() => setIsMetadataPanelOpen(false)}
        initialMetadata={packMetadata}
        onMetadataChange={(newMetadata) => {
          setPackMetadata(newMetadata)
          loadPack() // Reload pack data to reflect changes
        }}
      />

      {/* Pack Beatmap Edit Panel */}
      <PackBeatmapEditPanel
        isOpen={editingBeatmapIndex !== null}
        onClose={handleCloseEditPanel}
        beatmapIndex={editingBeatmapIndex || 0}
        onBeatmapUpdated={loadPack}
      />
    </div>
  )
}

export default PackMakerPage
