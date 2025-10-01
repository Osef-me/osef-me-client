/**
 * Format bytes to human-readable size
 * Prefers MB for beatmap downloads
 */
export function formatBytes(bytes: number, preferMB: boolean = false): string {
  if (bytes === 0) return '0 MB'
  
  const mb = bytes / (1024 * 1024)
  if (preferMB || mb >= 0.1) {
    return `${mb.toFixed(1)} MB`
  }
  
  const kb = bytes / 1024
  if (kb >= 1) {
    return `${kb.toFixed(1)} KB`
  }
  
  return `${bytes} B`
}

