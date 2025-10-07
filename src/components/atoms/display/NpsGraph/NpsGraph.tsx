import type React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

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
      <div className="bg-base-100 border border-base-300 rounded-box p-3 shadow-lg">
        <p className="text-base-content">
          Section: <span className="font-semibold text-primary">{data.time}</span>
        </p>
        <p className="text-base-content">
          NPS: <span className="font-semibold text-secondary">{data.nps.toFixed(2)}</span>
        </p>
      </div>
    )
  }
  return null
}

const NpsGraph: React.FC<NpsGraphProps> = ({ npsData, className = '' }) => {
  // Convert NPS array to chart data with color based on NPS value
  const chartData = npsData.map((nps, index) => {
    let color = '#3b82f6' // primary blue (default)
    
    if (nps >= 30) {
      color = '#ef4444' // error red - very high NPS
    } else if (nps >= 25) {
      color = '#f97316' // warning orange - high NPS
    } else if (nps >= 15) {
      color = '#22c55e' // success green - medium NPS
    } else {
      color = '#6b7280' // neutral gray - very low NPS
    }

    return {
      time: index,
      nps: nps,
      fill: color,
    }
  })

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-base-content">NPS Graph</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.2)" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--bc) / 0.6)"
            tick={{ fill: 'hsl(var(--bc) / 0.8)', fontSize: 12 }}
          />
          <YAxis 
            stroke="hsl(var(--bc) / 0.6)"
            tick={{ fill: 'hsl(var(--bc) / 0.8)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="nps" 
            radius={[2, 2, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default NpsGraph
