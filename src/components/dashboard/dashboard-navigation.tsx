'use client'

import { Bell, ChevronRight, House } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Overview', href: '/job-seeker' },
  { label: 'Pyschometric', href: '/job-seeker/personality' },
  { label: 'Job Matches', href: '/job-seeker/job-matches' },
  { label: 'Learning Paths', href: '/job-seeker/learning-paths' },
] as const

export function DashboardNavigation() {
  const pathname = usePathname()
  const currentLabel =
    pathname === '/job-seeker'
      ? 'Overview'
      : (TABS.find((tab) => 'href' in tab && tab.href === pathname)?.label ??
        'Overview')

  return (
    <header className="grid items-center gap-3 py-1 lg:grid-cols-[minmax(150px,1fr)_auto_minmax(150px,1fr)]">
      <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
        <House className="size-4" />
        <span>Dashboard</span>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{currentLabel}</span>
      </div>

      <nav
        aria-label="Dashboard sections"
        className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-[#EBE8F3] bg-white p-1 shadow-[0_4px_18px_rgba(38,30,92,0.04)]"
      >
        {TABS.map((tab) => {
          const active = 'href' in tab && tab.href === pathname
          const classes = cn(
            'whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-medium transition-colors sm:px-4',
            active
              ? 'bg-primary font-semibold text-white'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )

          return (
            <Link key={tab.label} href={tab.href} aria-current={active ? 'page' : undefined} className={classes}>
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className="hidden justify-end gap-2 lg:flex">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Notifikasi"
          title="Notifikasi"
          className="relative rounded-xl bg-white"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" />
        </Button>
      </div>
    </header>
  )
}
