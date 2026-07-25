'use client'

import { Bell, ChevronRight, Download, House } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Summary', href: '/job-seeker' },
  { label: 'Psychometric', href: '/job-seeker/personality' },
  { label: 'Learning paths' },
  { label: 'Job & Role Matches', href: '/job-seeker/job-matches' },
  { label: 'Personal analytics' },
] as const

export function DashboardNavigation() {
  const pathname = usePathname()
  const currentLabel =
    pathname === '/job-seeker'
      ? 'Overview'
      : (TABS.find((tab) => 'href' in tab && tab.href === pathname)?.label ??
        'Overview')

  return (
    <header className="grid items-center gap-3 py-1 lg:grid-cols-[1fr_auto_1fr]">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <House className="size-4" />
        <span>Dashboard</span>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{currentLabel}</span>
      </div>

      <nav
        aria-label="Dashboard sections"
        className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white bg-white p-1 shadow-sm"
      >
        {TABS.map((tab) => {
          const active = 'href' in tab && tab.href === pathname
          const classes = cn(
            'whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors',
            active
              ? 'bg-primary font-semibold text-white'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )

          return 'href' in tab ? (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={classes}
            >
              {tab.label}
            </Link>
          ) : (
            <button
              key={tab.label}
              type="button"
              title="Segera hadir"
              className={cn(classes, 'cursor-default')}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      <div className="hidden justify-end gap-2 lg:flex">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Unduh laporan"
          title="Unduh laporan — segera hadir"
          className="rounded-full bg-white"
        >
          <Download className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Notifikasi"
          title="Notifikasi"
          className="relative rounded-full bg-white"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" />
        </Button>
      </div>
    </header>
  )
}
