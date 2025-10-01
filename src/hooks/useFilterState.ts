import { useCallback, useState } from 'react'

export type FilterKind =
  | 'rating'
  | 'skillset'
  | 'bpm'
  | 'total_time'
  | 'search_term'
  | 'technical_od'
  | 'technical_status'
  | 'drain'

export interface UseFilterStateOptions {
  initialBlocks?: FilterKind[]
  onBlockAdd?: (kind: FilterKind) => void
  onBlockRemove?: (kind: FilterKind) => void
  onClearAll?: () => void
}

export const useFilterState = (options: UseFilterStateOptions = {}) => {
  const { initialBlocks = [], onBlockAdd, onBlockRemove, onClearAll } = options
  const [blocks, setBlocks] = useState<FilterKind[]>(initialBlocks)
  const [activeFilterIndex, setActiveFilterIndex] = useState(-1)

  const addBlock = useCallback(
    (kind: FilterKind) => {
      if (blocks.includes(kind)) return

      setBlocks((prev) => [...prev, kind])
      onBlockAdd?.(kind)
    },
    [blocks, onBlockAdd]
  )

  const removeBlock = useCallback(
    (kind: FilterKind) => {
      setBlocks((prev) => prev.filter((k) => k !== kind))
      onBlockRemove?.(kind)

      // Adjust active index if needed
      if (activeFilterIndex >= blocks.length - 1) {
        setActiveFilterIndex((prev) => Math.max(0, prev - 1))
      }
    },
    [blocks.length, activeFilterIndex, onBlockRemove]
  )

  const clearAll = useCallback(() => {
    setBlocks([])
    setActiveFilterIndex(-1)
    onClearAll?.()
  }, [onClearAll])

  const navigateLeft = useCallback(() => {
    if (blocks.length === 0) return
    setActiveFilterIndex((prev) => (prev > 0 ? prev - 1 : blocks.length - 1))
  }, [blocks.length])

  const navigateRight = useCallback(() => {
    if (blocks.length === 0) return
    setActiveFilterIndex((prev) => (prev < blocks.length - 1 ? prev + 1 : 0))
  }, [blocks.length])

  const removeActiveOrLast = useCallback(() => {
    if (blocks.length === 0) return

    if (activeFilterIndex >= 0 && activeFilterIndex < blocks.length) {
      const kind = blocks[activeFilterIndex]
      removeBlock(kind)
    } else {
      const lastKind = blocks[blocks.length - 1]
      removeBlock(lastKind)
    }
  }, [blocks, activeFilterIndex, removeBlock])

  return {
    blocks,
    activeFilterIndex,
    addBlock,
    removeBlock,
    clearAll,
    navigateLeft,
    navigateRight,
    removeActiveOrLast,
    setActiveFilterIndex,
  }
}
