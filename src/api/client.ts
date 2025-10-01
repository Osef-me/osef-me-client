type FetchOptions = RequestInit & { params?: Record<string, string | number | boolean | undefined> }

// Hard source globals from src/global.ts to avoid env plumbing
import { API_BASE_URL } from '@/global'

const BASE_URL = API_BASE_URL

let warnedNoBase = false

const buildUrl = (path: string, params?: Record<string, unknown>): string => {
  const url = new URL(
    (BASE_URL || '') + path,
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  )
  if (params) {
    const append = (prefix: string, value: unknown) => {
      if (value === undefined || value === null) return
      if (typeof value === 'object' && !Array.isArray(value)) {
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          append(`${prefix}[${k}]`, v)
        }
      } else if (Array.isArray(value)) {
        for (const v of value) {
          append(`${prefix}[]`, v)
        }
      } else {
        url.searchParams.set(prefix, String(value))
      }
    }
    for (const [k, v] of Object.entries(params)) {
      append(k, v)
    }
  }
  return url.toString()
}

export async function apiGet<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options
  const url = buildUrl(path, params)
  if (!warnedNoBase && typeof window !== 'undefined' && !BASE_URL) {
    // eslint-disable-next-line no-console
    console.warn(
      '[api] BASE_URL is empty. Set API_BASE_URL (or VITE_API_BASE_URL / RSBUILD_API_BASE_URL) in .env'
    )
    warnedNoBase = true
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...rest,
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`API GET ${url} failed: ${response.status} ${text}`)
  }
  const raw = await response.text()
  try {
    return JSON.parse(raw) as T
  } catch (e) {
    // Log the raw body to help diagnose malformed JSON
    // eslint-disable-next-line no-console
    console.error('Failed to parse JSON for', url, 'Raw response:', raw)
    throw e
  }
}

export const apiClient = {
  get: apiGet,
}
