'use client'

import {
  FileText,
  LayoutDashboard,
  Settings,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard', href: '/job-seeker', icon: LayoutDashboard },
  { label: 'CV Onboarding', href: '/job-seeker/onboarding', icon: FileText },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card px-3 py-5 md:flex">
      <div className="flex items-center px-2 pb-6">
        <Image
          src="/logo-color.png"
          alt="SAKTI Ai"
          width={120}
          height={40}
          className="h-9 w-auto"
          priority
        />
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-6">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Settings
        </p>
        <Link
          href="/job-seeker/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="size-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
