import type React from 'react'
import type { Score } from '@/types/leaderboard'
import { formatAccuracy, formatDate, formatScore, HIT_COLORS } from '@/utils/leaderboard'

interface ScoreRowProps {
  score: Score
  rank: number
}

const ScoreRow: React.FC<ScoreRowProps> = ({ score, rank }) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500'
      case 2:
        return 'text-gray-400'
      case 3:
        return 'text-amber-600'
      default:
        return 'text-base-content'
    }
  }

  return (
    <tr className="hover:bg-base-300">
      <td>
        <span className={`font-bold ${getRankColor(rank)}`}>#{rank}</span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <span className="font-medium">{score.user.username}</span>
          <span className={`badge badge-sm ${getRankColor(Number(score.rank))}`}>{score.rank}</span>
        </div>
      </td>
      <td className="font-mono text-sm">{formatScore(score.performance.score)}</td>
      <td className="font-mono text-sm">{formatAccuracy(score.performance.accuracy)}</td>
      <td className={`font-mono text-sm ${HIT_COLORS.MARVELOUS}`}>{score.hits.count_geki}</td>
      <td className={`font-mono text-sm ${HIT_COLORS.PERFECT}`}>{score.hits.count_300}</td>
      <td className={`font-mono text-sm ${HIT_COLORS.GREAT}`}>{score.hits.count_katu}</td>
      <td className={`font-mono text-sm ${HIT_COLORS.GOOD}`}>{score.hits.count_100}</td>
      <td className={`font-mono text-sm ${HIT_COLORS.BAD}`}>{score.hits.count_50}</td>
      <td className={`font-mono text-sm ${HIT_COLORS.MISS}`}>{score.hits.count_miss}</td>
      <td className="font-mono text-sm">{score.performance.max_combo}x</td>
      <td className="font-mono text-sm">{score.mods}</td>
      <td className="font-mono text-sm">{score.performance.pause_count}</td>
      <td className="text-xs text-base-content/60">{formatDate(score.created_at)}</td>
    </tr>
  )
}

export default ScoreRow
