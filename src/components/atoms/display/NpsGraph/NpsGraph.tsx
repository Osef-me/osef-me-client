import type React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface NpsGraphProps {
  npsData: number[]
  className?: string
}

interface TooltipPayload {
  payload: {
    time: number
    nps: number
  }
}

// Custom Tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (active && payload && payload.length && payload[0]) {
    const data = payload[0].payload
    return (
      <div className="bg-base-200 border border-base-300 rounded-lg p-3 shadow-lg">
        <p className="text-base-content">
          Section: <span className="font-semibold">{data.time}</span>
        </p>
        <p className="text-base-content">
          NPS: <span className="font-semibold text-primary">{data.nps.toFixed(2)}</span>
        </p>
      </div>
    )
  }
  return null
}

const NpsGraph: React.FC<NpsGraphProps> = ({ npsData, className = '' }) => {
  // Convert NPS array to chart data
  const chartData = npsData.map((nps, index) => ({
    time: index,
    nps: nps,
  }))

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-base-content">NPS Graph</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--bc) / 0.5)"
            tick={{ fill: 'hsl(var(--bc) / 0.7)' }}
          />
          <YAxis 
            stroke="hsl(var(--bc) / 0.5)"
            tick={{ fill: 'hsl(var(--bc) / 0.7)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="nps" fill="hsl(var(--p))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default NpsGraph
