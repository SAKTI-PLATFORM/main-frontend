'use client'

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

export interface RadarDatum {
  label: string
  value: number // 0..100
}

interface ProfileRadarChartProps {
  data: RadarDatum[]
  /** Stroke/fill colour for the radar polygon (solid hex). */
  color?: string
  /** Unique id so two radars on one page don't share a gradient def. */
  gradientId?: string
  /** Dashed outline (OCEAN in the mock) vs solid (RIASEC). */
  dashed?: boolean
  height?: number
}

/** Reusable radar used for both the OCEAN and RIASEC dashboards. */
export function ProfileRadarChart({
  data,
  color = '#6366f1',
  gradientId = 'radarFill',
  dashed = false,
  height = 280,
}: ProfileRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <stop offset="100%" stopColor={color} stopOpacity={0.12} />
          </radialGradient>
        </defs>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
        />
        <Radar
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dashed ? '5 4' : undefined}
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          dot={{ r: 4, fill: color, stroke: '#ffffff', strokeWidth: 1.5 }}
          isAnimationActive={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
