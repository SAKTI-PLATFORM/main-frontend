'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BenchmarkBar } from '@/types/seeker.types'

interface BenchmarkBarChartProps {
  bars: BenchmarkBar[]
  height?: number
}

const MARKET_FROM = '#c4b5fd' // violet-300
const MARKET_TO = '#8b5cf6' // violet-500
const YOU_FROM = '#93c5fd' // blue-300
const YOU_TO = '#2563eb' // blue-600

/** Grouped bars: market demand vs the seeker's own mastery, per demanded skill. */
export function BenchmarkBarChart({ bars, height = 280 }: BenchmarkBarChartProps) {
  const data = bars.map((bar) => ({
    skill: bar.skill,
    'Market Demand': Number(bar.marketDemand.toFixed(2)),
    'Your Score': Number(bar.yourScore.toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
        <defs>
          <linearGradient id="benchMarket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={MARKET_TO} />
            <stop offset="100%" stopColor={MARKET_FROM} />
          </linearGradient>
          <linearGradient id="benchYou" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={YOU_TO} />
            <stop offset="100%" stopColor={YOU_FROM} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="skill"
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
          interval={0}
          tickLine={false}
        />
        <YAxis
          domain={[0, 1]}
          tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
          contentStyle={{
            background: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Market Demand" fill="url(#benchMarket)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
        <Bar dataKey="Your Score" fill="url(#benchYou)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}
