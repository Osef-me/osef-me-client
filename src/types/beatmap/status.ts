/**
 * Types for beatmap status
 */

import type { ReactNode } from 'react'
import type { ColorName } from '@/types/colors'

/**
 * Possible statuses for a beatmap
 */
export type BeatmapStatusType =
  | 'ranked'
  | 'loved'
  | 'graveyard'
  | 'approved'
  | 'qualified'
  | 'pending'
  | 'wip'
  | 'unknown'

/**
 * Interface for a beatmap's priority status with its display
 */
export interface BeatmapStatus {
  /** The status type */
  status: BeatmapStatusType
  /** The color associated with the status */
  color: ColorName
  /** The icon to display for this status */
  icon: ReactNode
}
