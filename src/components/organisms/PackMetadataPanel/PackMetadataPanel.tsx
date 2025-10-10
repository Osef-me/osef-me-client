import React, { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Button, Input } from '@/components/atoms'
import { SideMenu } from '@/components/molecules'

interface PackMetadata {
  name: string
  author: string
  creator: string
}

interface PackMetadataPanelProps {
  isOpen: boolean
  onClose: () => void
  initialMetadata: PackMetadata
  onMetadataChange: (metadata: PackMetadata) => void
}

const PackMetadataPanel: React.FC<PackMetadataPanelProps> = ({
  isOpen,
  onClose,
  initialMetadata,
  onMetadataChange,
}) => {
  const [metadata, setMetadata] = useState<PackMetadata>(initialMetadata)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      await invoke('update_pack_metadata', { metadata })
      onMetadataChange(metadata)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof PackMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }))
  }

  return (
    <SideMenu
      isOpen={isOpen}
      onClose={onClose}
      title="Pack Metadata"
      width="400px"
    >
      <div className="space-y-4">
        {/* Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Pack Name</span>
          </label>
          <Input
            type="text"
            value={metadata.name}
            onChange={(value) => handleInputChange('name', value)}
            placeholder="Enter pack name"
            className="w-full"
          />
        </div>

        {/* Author */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Author</span>
          </label>
          <Input
            type="text"
            value={metadata.author}
            onChange={(value) => handleInputChange('author', value)}
            placeholder="Enter author name"
            className="w-full"
          />
        </div>

        {/* Creator */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Creator</span>
          </label>
          <Input
            type="text"
            value={metadata.creator}
            onChange={(value) => handleInputChange('creator', value)}
            placeholder="Enter creator name"
            className="w-full"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            color="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={onClose} style="outline" className="flex-1" disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </SideMenu>
  )
}

export default PackMetadataPanel
