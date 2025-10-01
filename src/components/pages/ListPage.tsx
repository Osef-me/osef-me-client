import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getBeatmaps } from '@/api/get_short'
import { BeatmapGrid } from '@/components/molecules'
import FilterSection from '@/components/organisms/FilterSection/FilterSection'
import type { PaginatedResponse } from '@/types'
import type { BeatmapListParams } from '@/types/beatmap/filters'
import type { BeatmapsetShort } from '@/types/beatmap/short'

const ListPage: React.FC = () => {
  const [items, setItems] = useState<BeatmapsetShort[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [perPage] = useState<number>(9)
  const [total, setTotal] = useState<number>(0)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [filters, setFilters] = useState<BeatmapListParams>({ page: 0, per_page: 9 })

  const buildParams = useCallback(
    (pageNum: number, perPageNum: number): BeatmapListParams => {
      const base = { ...filters }
      const rating = { rating_type: 'etterna', ...(base.rating || {}) }
      return { ...base, rating, page: pageNum, per_page: perPageNum }
    },
    [filters]
  )

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await getBeatmaps(buildParams(0, perPage))
        if (!mounted) return
        setItems(res.data)
        setTotal(res.pagination?.total ?? res.data.length)
        setPage(0)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Failed to load beatmaps')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [perPage, buildParams])

  const hasMore = items.length < total

  const loadMore = useCallback(async () => {
    if (loading || isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    const nextPage = page + 1
    try {
      const res: PaginatedResponse<BeatmapsetShort> = await getBeatmaps(
        buildParams(nextPage, perPage)
      )
      setItems((prev) => [...prev, ...res.data])
      setPage(nextPage)
      setTotal(res.pagination?.total ?? res.data.length)
    } catch (e: any) {
      setError(e?.message || 'Failed to load more beatmaps')
    } finally {
      setIsLoadingMore(false)
    }
  }, [loading, isLoadingMore, hasMore, page, buildParams, perPage])

  // Auto-load more if content doesn't overflow (no scrollbar)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (loading || isLoadingMore) return
    if (!hasMore) return
    const needsMore = document.documentElement.scrollHeight <= window.innerHeight + 8
    if (needsMore) {
      // Fire and forget; library will append
      loadMore()
    }
  }, [loading, isLoadingMore, hasMore, loadMore])

  if (loading) return <div>Loading…</div>
  if (error) return <div className="text-error">{error}</div>
  if (!items || items.length === 0) return <div>No results</div>

  return (
    <>
      <div className="mb-4">
        <FilterSection
          value={filters}
          onChange={(v) => setFilters({ ...v, page: 0, per_page: perPage })}
        />
      </div>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="py-4 text-center">Loading…</div>}
        style={{ overflow: 'visible' }}
      >
        <BeatmapGrid beatmapsets={items} />
      </InfiniteScroll>
    </>
  )
}

export default ListPage
