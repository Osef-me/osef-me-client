import type React from 'react'
import { BeatmapGrid } from '@/components/molecules'
import FilterSection from '@/components/organisms/FilterSection/FilterSection'
import { useBeatmaps } from '@/hooks/beatmap/useBeatmaps'
import { useBeatmapFilters } from '@/hooks/beatmap/useBeatmapFilters'

const ListPage: React.FC = () => {
  const filtersManager = useBeatmapFilters()
  const { filters } = filtersManager

  const {
    data: items,
    total,
    loading,
    error,
    currentPage,
    totalPages,
    refetch,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = useBeatmaps(filters)

  return (
    <>
      <div className="mb-4">
        <FilterSection
          value={filters}
          onChange={filtersManager.setFilters}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold mb-2">Loading beatmaps...</h3>
          <p className="text-base-content/70">
            Please wait while we fetch the latest beatmaps
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold mb-2 text-error">Error loading beatmaps</h3>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-base-content/70 mb-4">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <>
          <BeatmapGrid beatmapsets={items} />

          {/* Pagination Controls - Only show when not in random mode */}
          {!filters.random && totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 px-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={prevPage}
                disabled={!hasPrevPage}
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/70">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <span className="text-sm text-base-content/50">
                  ({total} results)
                </span>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={nextPage}
                disabled={!hasNextPage}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default ListPage
