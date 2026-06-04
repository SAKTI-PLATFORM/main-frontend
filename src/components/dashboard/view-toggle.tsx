'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Skills', href: '/job-seeker' },
  { label: 'Personality', href: '/job-seeker/personality' },
] as const

/** Segmented SKILLS / PERSONALITY switch that routes between the two dashboards. */
export function ViewToggle() {
  const pathname = usePathname()

  return (
    <div className="inline-flex rounded-lg bg-muted p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
