import { cn } from '@/lib/utils'

const PARTICLE_COUNT = 36
const CURVE_POINTS = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2
  const x = 50 + (7 * Math.cos(angle) - 2.8 * Math.cos(7 * angle)) * 4
  const y = 50 + (7 * Math.sin(angle) - 2.8 * Math.sin(7 * angle)) * 4

  return { x, y }
})

const CURVE_PATH = `${CURVE_POINTS.map(
  ({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`,
).join(' ')} Z`

export function MathCurveLoader({
  size = 48,
  label = 'Memuat',
  className,
}: {
  size?: number
  label?: string
  className?: string
}) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn('math-curve-loader shrink-0', className)}
    >
      <g className="math-curve-loader__orbit">
        <path
          d={CURVE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.16"
        />
        {CURVE_POINTS.map(({ x, y }, index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2.2"
            fill="currentColor"
            className="math-curve-loader__particle"
            style={{ animationDelay: `${(-index / PARTICLE_COUNT) * 1.8}s` }}
          />
        ))}
      </g>
    </svg>
  )
}
