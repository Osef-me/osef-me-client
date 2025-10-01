import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { MdFolder, MdSave } from 'react-icons/md'

const SettingsPage: React.FC = () => {
  const [songsPath, setSongsPath] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const path = await invoke<string>('get_songs_path')
      setSongsPath(path)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setMessage(null)

    try {
      await invoke('set_songs_path', { path: songsPath })
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to save: ${error}` })
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">
            <MdFolder size={24} />
            Download Settings
          </h2>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Songs Folder Path</span>
            </label>
            <input
              type="text"
              placeholder="e.g., F:/Osu!Fx/Songs or /home/user/osu/Songs"
              className="input input-bordered w-full"
              value={songsPath}
              onChange={(e) => setSongsPath(e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt">
                Path where beatmaps will be downloaded
              </span>
            </label>
          </div>

          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mt-4`}>
              <span>{message.text}</span>
            </div>
          )}

          <div className="card-actions justify-end mt-4">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <MdSave size={20} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-base-200 rounded-lg">
        <h3 className="font-semibold mb-2">Note:</h3>
        <ul className="list-disc list-inside text-sm text-base-content/70">
          <li>Use absolute paths (e.g., F:/Osu!/Songs on Windows or /home/user/osu/Songs on Linux)</li>
          <li>Make sure the folder exists and you have write permissions</li>
          <li>Settings are saved automatically to your system</li>
        </ul>
      </div>
    </div>
  )
}

export default SettingsPage

