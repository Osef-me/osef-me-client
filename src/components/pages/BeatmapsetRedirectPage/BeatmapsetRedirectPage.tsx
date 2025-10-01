import type React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBeatmapset } from '@/hooks/beatmap/useBeatmapset'

const BeatmapsetRedirectPage: React.FC = () => {
  const { beatmapsetOsuId } = useParams<{ beatmapsetOsuId: string }>()
  const navigate = useNavigate()

  const { beatmapset, loading, error } = useBeatmapset(
    beatmapsetOsuId ? parseInt(beatmapsetOsuId, 10) : undefined
  )

  useEffect(() => {
    if (beatmapset && !loading) {
      // Redirect to the first beatmap
      const firstBeatmap = beatmapset.beatmaps[0]
      if (firstBeatmap) {
        navigate(`/beatmapsets/${beatmapsetOsuId}/${firstBeatmap.beatmap_osu_id}`, {
          replace: true,
        })
      }
    }
  }, [beatmapset, loading, beatmapsetOsuId, navigate])

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Erreur lors du chargement du beatmapset: {error.message}</span>
      </div>
    )
  }

  if (loading || !beatmapset) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return null // This component only redirects
}

export default BeatmapsetRedirectPage
