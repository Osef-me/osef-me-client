import type React from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { getSkillsetShortcut } from '@/types/beatmap/skillset'
import { COLOR_HEX } from '@/types/colors'
import { getRatingColor } from '@/utils/ratingColors'
import type { ManiaRadarChartProps } from './ManiaRadarChart.props'

interface TooltipPayload {
  payload: {
    ratingColor: string
    fullName: string
    value: number
  }
}

// Custom Tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (active && payload && payload.length && payload[0]) {
    const data = payload[0].payload
    return (
      <div className="bg-base-200 border border-base-300 rounded-lg p-3 shadow-lg">
        <p className="font-bold text-base-content" style={{ color: data.ratingColor }}>
          {data.fullName}
        </p>
        <p className="text-base-content">
          Rating:{' '}
          <span className="font-semibold" style={{ color: data.ratingColor }}>
            {data.value.toFixed(2)}
          </span>
        </p>
      </div>
    )
  }
  return null
}

// Custom Dot avec couleur basée sur le rating
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  if (cx == null || cy == null) return null

  // Recharts imbrique parfois les données sous payload.payload
  const ratingColor = payload?.ratingColor || payload?.payload?.ratingColor
  const fill = ratingColor || '#000'

  return <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#fff" strokeWidth={2} />
}

const ManiaRadarChart: React.FC<ManiaRadarChartProps> = ({
  maniaRating,
  overallRating,
  className = '',
  height = 300,
}) => {
  if (!maniaRating) {
    return null
  }

  // Préparer les données pour le radar chart
  const data = [
    {
      skillset: getSkillsetShortcut('stream'),
      value: maniaRating.stream,
      fullName: 'Stream',
      ratingColor: COLOR_HEX[getRatingColor(maniaRating.stream)],
    },
    {
      skillset: getSkillsetShortcut('jumpstream'),
      value: maniaRating.jumpstream,
      fullName: 'Jumpstream',
      ratingColor: COLOR_HEX[getRatingColor(maniaRating.jumpstream)],
    },
    {
      skillset: getSkillsetShortcut('handstream'),
      value: maniaRating.handstream,
      fullName: 'Handstream',
      ratingColor: COLOR_HEX[getRatingColor(maniaRating.handstream)],
    },
    {
      skillset: getSkillsetShortcut('stamina'),
      value: maniaRating.stamina,
      fullName: 'Stamina',
      ratingColor: COLOR_HEX[getRatingColor(maniaRating.stamina)],
    },
    {
      skillset: getSkillsetShortcut('jackspeed'),
      value: maniaRating.jackspeed,
      fullName: 'Jackspeed',
      ratingColor: COLOR_HEX[getRatingColor(maniaRating.jackspeed)],
    },
    {
      skillset: getSkillsetShortcut('chordjack'),
      value: maniaRating.chordjack,
      fullName: 'Chordjack',
      ratingColor: COLOR_HEX[getRatingColor(maniaRating.chordjack)],
    },
    {
      skillset: getSkillsetShortcut('technical'),
      value: maniaRating.technical,
      fullName: 'Technical',
      ratingColor: COLOR_HEX[getRatingColor(maniaRating.technical)],
    },
  ]

  // Calculer la valeur max pour l'échelle
  const maxValue = Math.max(...data.map((d) => d.value))
  const roundedMax = Math.ceil(maxValue / 5) * 5

  // Utiliser l'overall rating donné en paramètre
  const overallValue = overallRating ?? data.reduce((sum, d) => sum + d.value, 0) / data.length
  const overallColor = COLOR_HEX[getRatingColor(overallValue)]

  return (
    <div className={`${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          <PolarGrid stroke="#444" />
          <PolarAngleAxis dataKey="skillset" tick={{ fill: '#fff', fontSize: 12 }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, roundedMax]}
            tick={{ fill: '#888', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Surface colorée basée sur la valeur de l'overall (moyenne) */}
          <Radar
            name="Overall Average"
            dataKey="value"
            stroke={overallColor}
            fill={overallColor}
            fillOpacity={0.3}
            strokeWidth={2}
            dot={false}
          />

          {/* Points colorés par rating individuel */}
          <Radar
            name="Skillset Rating"
            dataKey="value"
            stroke="transparent"
            fill="transparent"
            strokeWidth={0}
            dot={<CustomDot />}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ManiaRadarChart
