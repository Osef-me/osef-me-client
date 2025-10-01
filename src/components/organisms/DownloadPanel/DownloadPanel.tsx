import React, { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core'
import { MdDownload, MdCheckCircle, MdError, MdClose, MdBugReport } from 'react-icons/md'
import { formatBytes } from '@/utils/format'

// Types must match the Rust backend types
export interface DownloadStatus {
  beatmapset_id: number
  filename: string
  display_name: string
  status: string // Will be "Queued" | "Downloading" | "Completed" | "Failed"
  progress: number
  error?: string
  downloaded_bytes: number
  total_bytes?: number
}

const DownloadPanel: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadStatus[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Listen for download status updates
    const unlisten = listen('download-status-update', (event) => {
      console.log('📡 Received download status update:', event.payload)
      const statusList: DownloadStatus[] = event.payload as DownloadStatus[]
      console.log(`📊 Updated downloads: ${statusList.length} items`)
      setDownloads(statusList)
      
      // Show panel when there are downloads
      if (statusList.length > 0) {
        setIsVisible(true)
      }
    })

    return () => {
      unlisten.then(fn => fn())
    }
  }, [])


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <MdCheckCircle className="text-green-500" size={20} />
      case 'Failed':
        return <MdError className="text-red-500" size={20} />
      case 'Downloading':
        return <MdDownload className="text-blue-500 animate-pulse" size={20} />
      default:
        return <MdDownload className="text-gray-500" size={20} />
    }
  }

  const activeDownloads = downloads.filter(d => d.status === 'Downloading' || d.status === 'Queued')
  const completedDownloads = downloads.filter(d => d.status === 'Completed' || d.status === 'Failed')

  // Don't show panel if hidden or no downloads
  if (!isVisible || downloads.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 w-96 bg-base-100 shadow-xl rounded-lg border border-base-300 z-50 max-h-96 overflow-hidden">
      <div className="bg-primary text-primary-content p-3 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MdDownload size={20} />
          Downloads ({activeDownloads.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                console.log('🧪 Testing download event...')
                await invoke('test_download_event', { beatmapsetId: 12345 })
                console.log('✅ Test event sent')
              } catch (error) {
                console.error('❌ Test event failed:', error)
              }
            }}
            className="btn btn-sm btn-ghost text-primary-content"
            title="Test download events"
          >
            <MdBugReport size={16} />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="btn btn-sm btn-ghost text-primary-content"
            title="Close panel"
          >
            <MdClose size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {downloads.length === 0 ? (
          <div className="p-4 text-center text-base-content/60">
            No downloads in progress
          </div>
        ) : (
          <div className="p-2">
            {downloads.map((download) => (
              <div key={download.beatmapset_id} className="mb-3 bg-base-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getStatusIcon(download.status)}
                    <span className="font-medium text-sm truncate">
                      {download.display_name}
                    </span>
                  </div>
                  <span className="text-xs text-base-content/60">
                    {Math.round(download.progress)}%
                  </span>
                </div>

                <div className="w-full bg-base-300 rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${download.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-base-content/60">
                  <span>
                    {formatBytes(download.downloaded_bytes, true)}
                    {download.total_bytes && ` / ${formatBytes(download.total_bytes, true)}`}
                  </span>
                  <span className={`font-medium ${
                    download.status === 'Completed' ? 'text-green-500' :
                    download.status === 'Failed' ? 'text-red-500' :
                    'text-blue-500'
                  }`}>
                    {download.status}
                  </span>
                </div>

                {download.error && (
                  <div className="mt-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {download.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {completedDownloads.length > 0 && (
        <div className="border-t border-base-300 p-2 bg-base-200">
          <div className="text-xs text-base-content/60 text-center">
            {completedDownloads.length} download(s) completed
          </div>
        </div>
      )}
    </div>
  )
}

export default DownloadPanel
