import type React from 'react'
import { useId } from 'react'
// Components
import {
  FilterBlockBpm,
  FilterBlockDrain,
  FilterBlockRating,
  FilterBlockSearch,
  FilterBlockSkillset,
  FilterBlockTechnicalOD,
  FilterBlockTechnicalStatus,
  FilterBlockTotalTime,
  FilterGrid,
  FilterSectionHeader,
} from '@/components/molecules'
import FilterBlockRandom from '@/components/molecules/FilterBlock/blocks/FilterBlockRandom'
import { useDropdown } from '@/hooks/useDropdown'

// Hooks
import { useFilterState } from '@/hooks/useFilterState'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useToast } from '@/hooks/useToast'
import type { BeatmapListParams } from '@/types/beatmap/filters'
import type { FilterSectionProps, SectionKind } from './FilterSection.props'

const FilterSection: React.FC<FilterSectionProps> = ({ value, onChange, className }) => {
  const update = (partial: Partial<BeatmapListParams>) => onChange({ ...value, ...partial })
  const filterSectionId = useId()
  const toast = useToast()

  // Filter sharing functions
  const serializeFilters = (filters: BeatmapListParams): string => {
    const cleanFilters = { ...filters }
    // Remove page and per_page as they're not part of the filter state
    delete cleanFilters.page
    delete cleanFilters.per_page
    return btoa(JSON.stringify(cleanFilters))
  }

  const deserializeFilters = (encoded: string): BeatmapListParams | null => {
    try {
      const decoded = JSON.parse(atob(encoded))
      return decoded
    } catch {
      return null
    }
  }

  const copyFiltersToClipboard = async () => {
    try {
      const serialized = serializeFilters(value)
      await navigator.clipboard.writeText(serialized)
      toast.showSuccess('Filters copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy filters to clipboard:', err)
      toast.showError('Failed to copy filters')
    }
  }

  const pasteFiltersFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const filters = deserializeFilters(text)
      if (filters) {
        onChange({ ...filters, page: 0, per_page: value.per_page })
        toast.showSuccess('Filters applied successfully!')
      } else {
        toast.showError('Invalid filter format')
      }
    } catch (err) {
      console.error('Failed to paste filters from clipboard:', err)
      toast.showError('Failed to paste filters')
    }
  }

  const rerollBeatmaps = () => {
    // Force refresh by changing a parameter that doesn't affect the results
    onChange({ ...value, page: Math.random() })
    toast.showInfo('Rerolling beatmaps...')
  }

  // Use custom hooks
  const dropdown = useDropdown()
  const filterState = useFilterState({
    onBlockAdd: (kind) => {
      // Initialize default values for the new filter block
      switch (kind) {
        case 'rating':
          if (!value.rating) {
            update({ rating: { rating_type: '', rating_min: null, rating_max: undefined } })
          }
          break
        case 'skillset':
          if (!value.skillset) {
            update({ skillset: { pattern_type: undefined, pattern_min: null, pattern_max: undefined } })
          }
          break
        case 'bpm':
          if (!value.beatmap?.bpm_min && !value.beatmap?.bpm_max) {
            update({ beatmap: { ...value.beatmap, bpm_min: undefined, bpm_max: undefined } })
          }
          break
        case 'total_time':
          if (!value.beatmap?.total_time_min && !value.beatmap?.total_time_max) {
            update({
              beatmap: { ...value.beatmap, total_time_min: undefined, total_time_max: undefined },
            })
          }
          break
        case 'search_term':
          if (!value.beatmap?.search_term) {
            update({ beatmap: { ...value.beatmap, search_term: '' } })
          }
          break
        case 'technical_od':
          if (!value.beatmap_technical?.od_min && !value.beatmap_technical?.od_max) {
            update({
              beatmap_technical: { ...value.beatmap_technical, od_min: undefined, od_max: undefined },
            })
          }
          break
        case 'technical_status':
          if (!value.beatmap_technical?.status) {
            update({ beatmap_technical: { ...value.beatmap_technical, status: undefined } })
          }
          break
        case 'drain':
          if (!value.rates?.drain_time_min && !value.rates?.drain_time_max) {
            update({
              rates: { ...value.rates, drain_time_min: undefined, drain_time_max: undefined },
            })
          }
          break
      }
    },
    onBlockRemove: (kind) => {
      // Clear corresponding values when removing blocks
      switch (kind) {
        case 'rating':
          update({ rating: undefined })
          break
        case 'skillset':
          update({ skillset: undefined })
          break
        case 'bpm':
          update({ beatmap: { ...value.beatmap, bpm_min: undefined, bpm_max: undefined } })
          break
        case 'total_time':
          update({
            beatmap: { ...value.beatmap, total_time_min: undefined, total_time_max: undefined },
          })
          break
        case 'search_term':
          update({ beatmap: { ...value.beatmap, search_term: undefined } })
          break
        case 'technical_od':
          update({
            beatmap_technical: { ...value.beatmap_technical, od_min: undefined, od_max: undefined },
          })
          break
        case 'technical_status':
          update({ beatmap_technical: { ...value.beatmap_technical, status: undefined } })
          break
        case 'drain':
          update({
            rates: { ...value.rates, drain_time_min: undefined, drain_time_max: undefined },
          })
          break
      }
    },
    onClearAll: () => {
      onChange({ page: 0, per_page: value.per_page })
    },
  })

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAdd: dropdown.open,
    onEscape: dropdown.close,
    onDeleteActive: filterState.removeActiveOrLast,
    onNavigateLeft: filterState.navigateLeft,
    onNavigateRight: filterState.navigateRight,
  })

  const renderBlock = (kind: SectionKind) => {
    switch (kind) {
      case 'rating':
        return <FilterBlockRating value={value.rating} onChange={(v) => update({ rating: v })} />
      case 'skillset':
        return (
          <FilterBlockSkillset value={value.skillset} onChange={(v) => update({ skillset: v })} />
        )
      case 'bpm':
        return (
          <FilterBlockBpm
            min={value.beatmap?.bpm_min}
            max={value.beatmap?.bpm_max}
            onChange={(min, max) =>
              update({ beatmap: { ...value.beatmap, bpm_min: min, bpm_max: max } })
            }
          />
        )
      case 'total_time':
        return (
          <FilterBlockTotalTime
            min={value.beatmap?.total_time_min}
            max={value.beatmap?.total_time_max}
            onChange={(min, max) =>
              update({ beatmap: { ...value.beatmap, total_time_min: min, total_time_max: max } })
            }
          />
        )
      case 'search_term':
        return (
          <FilterBlockSearch
            value={value.beatmap?.search_term}
            onChange={(v) => update({ beatmap: { ...value.beatmap, search_term: v } })}
          />
        )
      case 'technical_od':
        return (
          <FilterBlockTechnicalOD
            min={value.beatmap_technical?.od_min}
            max={value.beatmap_technical?.od_max}
            onChange={(min, max) =>
              update({
                beatmap_technical: { ...value.beatmap_technical, od_min: min, od_max: max },
              })
            }
          />
        )
      case 'technical_status':
        return (
          <FilterBlockTechnicalStatus
            value={value.beatmap_technical?.status}
            onChange={(v) =>
              update({ beatmap_technical: { ...value.beatmap_technical, status: v } })
            }
          />
        )
      case 'drain':
        return (
          <FilterBlockDrain
            min={value.rates?.drain_time_min}
            max={value.rates?.drain_time_max}
            onChange={(min, max) =>
              update({ rates: { ...value.rates, drain_time_min: min, drain_time_max: max } })
            }
          />
        )
      case 'random':
        return (
          <FilterBlockRandom
            value={value.random ?? false}
            onChange={(v) => update({ random: v })}
            onReroll={rerollBeatmaps}
          />
        )
      default:
        return null
    }
  }

  const allKinds: { value: SectionKind; label: string }[] = [
    { value: 'rating', label: 'Rating' },
    { value: 'skillset', label: 'Skillset' },
    { value: 'bpm', label: 'BPM' },
    { value: 'total_time', label: 'Total time' },
    { value: 'search_term', label: 'Search' },
    { value: 'technical_od', label: 'OD' },
    { value: 'technical_status', label: 'Status' },
    { value: 'drain', label: 'Drain Time' },
    { value: 'random', label: 'Random' },
  ]
  const availableKinds = allKinds.filter((k) => !filterState.blocks.includes(k.value))

  const filterBlocks = filterState.blocks.map((kind) => ({
    kind,
    key: `${kind}-${JSON.stringify(value)}`, // Force re-render when values change
    component: renderBlock(kind),
  }))

  return (
    <section
      className={`card bg-base-200 border border-base-300 transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20 ${className || ''}`}
      aria-labelledby={`${filterSectionId}-title`}
    >
      <div className="card-body p-3 sm:p-4">
        <FilterSectionHeader
          title="Filters"
          isDropdownOpen={dropdown.isOpen}
          onDropdownToggle={dropdown.toggle}
          onDropdownClose={dropdown.close}
          onOptionSelect={filterState.addBlock}
          availableOptions={availableKinds}
          onRemoveLast={() => {
            if (filterState.blocks.length > 0) {
              const lastKind = filterState.blocks[filterState.blocks.length - 1]
              filterState.removeBlock(lastKind)
            }
          }}
          onClearAll={filterState.clearAll}
          activeFilterCount={filterState.blocks.length}
          canRemove={filterState.blocks.length > 0}
          canClear={filterState.blocks.length > 0}
          onCopyFilters={copyFiltersToClipboard}
          onPasteFilters={pasteFiltersFromClipboard}
          filterSectionId={filterSectionId}
        />

        <FilterGrid
          blocks={filterBlocks.map(block => ({ ...block, key: block.key }))}
          activeIndex={filterState.activeFilterIndex}
          onRemove={filterState.removeBlock}
          onBlockFocus={filterState.setActiveFilterIndex}
          onBlockBlur={() => filterState.setActiveFilterIndex(-1)}
        />
      </div>
    </section>
  )
}

export default FilterSection
