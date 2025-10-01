import { invoke } from '@tauri-apps/api/core'

export const useDownload = () => {
  const downloadBeatmap = async (
    beatmapset_osu_id: number | undefined,
    beatmapsetName?: string,
    creator?: string
  ) => {
    if (!beatmapset_osu_id) {
      return
    }

    try {
      const downloadUrl = `https://catboy.best/d/${beatmapset_osu_id}`
      const filename = `${beatmapset_osu_id}.osz`

      console.log(`🎯 Download button clicked for beatmap ${beatmapset_osu_id}`)
      console.log(`📡 Calling Tauri command with URL: ${downloadUrl}`)

      const result = await invoke<string>('download_beatmap_from_url', {
        url: downloadUrl,
        filename: filename,
        beatmapsetName: beatmapsetName || 'Unknown',
        creator: creator || 'Unknown'
      })

      console.log('✅ Download result:', result)
    } catch (error) {
      console.error('❌ Download failed:', error)
    }
  }

  return { downloadBeatmap }
}
