import type React from 'react'
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
import { useDropdown } from '@/hooks/useDropdown'

// Hooks
import { useFilterState } from '@/hooks/useFilterState'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import type { BeatmapListParams } from '@/types/beatmap/filters'
import type { FilterSectionProps, SectionKind } from './FilterSection.props'

const FilterSection: React.FC<FilterSectionProps> = ({ value, onChange, className }) => {
  const update = (partial: Partial<BeatmapListParams>) => onChange({ ...value, ...partial })

  // Use custom hooks
  const dropdown = useDropdown()
  const filterState = useFilterState({
    onBlockAdd: (kind) => {
      // Clear corresponding values when adding blocks
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
  ]
  const availableKinds = allKinds.filter((k) => !filterState.blocks.includes(k.value))

  const filterBlocks = filterState.blocks.map((kind) => ({
    kind,
    component: renderBlock(kind),
  }))

  return (
    <section
      className={`card bg-base-200 border border-base-300 transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/20 ${className || ''}`}
      aria-labelledby="filter-section-title"
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
        />

        <FilterGrid
          blocks={filterBlocks}
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
