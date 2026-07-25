'use client'

import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  History,
  House,
  Search,
  Settings,
  Shapes,
  UserRound,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { authApi } from '@/api/auth.api'
import { Button } from '@/components/ui/button'
import { setUser } from '@/features/auth'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { cn } from '@/lib/utils'
import type { UserProfile } from '@/types/auth.types'

type NavigationItem = {
  label: string
  icon: typeof House
  href?: string
  expandable?: boolean
}

const NAVIGATION: Array<{
  label: string
  items: NavigationItem[]
}> = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/job-seeker', icon: House },
      { label: 'Sakti AI Chatbot', icon: Bot, expandable: true },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Eksplorasi Pekerjaan', icon: BriefcaseBusiness },
      { label: 'Eksplorasi Kompetensi', icon: Shapes },
      {
        label: 'Analisis Sakti AI',
        href: '/job-seeker/personality',
        icon: BarChart3,
      },
    ],
  },
  {
    label: 'Pengaturan',
    items: [
      { label: 'Histori Pribadi', icon: History },
      { label: 'Settings', icon: Settings },
    ],
  },
]

const COLLAPSED_ICONS = [Search, Building2, UserRound, Settings]

export function Sidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.auth.user)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (profile) return

    let active = true
    void authApi
      .me()
      .then((response) => {
        if (active) dispatch(setUser(response.data.data))
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [dispatch, profile])

  return (
    <aside
      className={cn(
        'sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-[#E7E6FA] bg-[#FAFAFF] transition-[width] duration-300 md:flex',
        collapsed ? 'w-[84px]' : 'w-[280px]',
      )}
    >
      <SidebarOrnament />

      <div
        className={cn(
          'relative z-10 flex h-[112px] shrink-0 items-center',
          collapsed ? 'justify-center px-4' : 'px-7',
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden transition-all duration-300',
            collapsed ? 'h-[58px] w-[42px]' : 'h-[64px] w-[178px]',
          )}
        >
          <Image
            src="/logo.png"
            alt="SAKTI AI"
            width={2246}
            height={856}
            className={cn(
              'absolute left-0 top-1/2 h-auto max-w-none -translate-y-1/2',
              collapsed ? 'w-[154px]' : 'w-[178px]',
            )}
            priority
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-[19px] top-[42px] z-20 size-10 rounded-[9px] border-[#CFC8FF] bg-[#FAFAFF] text-[#2815A7] shadow-none hover:bg-[#F1EFFF] hover:text-[#2815A7]"
        >
          {collapsed ? (
            <ChevronRight className="size-[18px]" strokeWidth={2.4} />
          ) : (
            <ChevronLeft className="size-[18px]" strokeWidth={2.4} />
          )}
        </Button>
      </div>

      {collapsed ? (
        <CollapsedNavigation pathname={pathname} />
      ) : (
        <ExpandedNavigation pathname={pathname} />
      )}

      <UserSummary collapsed={collapsed} profile={profile} />
    </aside>
  )
}

function ExpandedNavigation({ pathname }: { pathname: string }) {
  return (
    <nav className="relative z-10 min-h-0 flex-1 overflow-y-auto px-5 pb-5">
      {NAVIGATION.map((group, groupIndex) => (
        <div
          key={group.label}
          className={cn(
            'py-4',
            groupIndex > 0 && 'border-t border-[#E4E3F7]',
          )}
        >
          <p className="mb-2 px-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-[#8E8E9C]">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavigationRow key={item.label} item={item} pathname={pathname} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function NavigationRow({
  item,
  pathname,
}: {
  item: NavigationItem
  pathname: string
}) {
  const Icon = item.icon
  const dashboardRoute = isDashboardRoute(pathname)
  const active = item.href
    ? dashboardRoute
      ? item.href === '/job-seeker'
      : pathname.startsWith(item.href)
    : false
  const classes = cn(
    'flex h-12 w-full items-center gap-4 rounded-md px-3 text-left text-[16px] transition-colors',
    active
      ? 'bg-[#EFEEFF] font-semibold text-[#4138D8]'
      : 'font-normal text-[#9293A2]',
    item.href
      ? 'hover:bg-[#F3F2FF] hover:text-[#4138D8]'
      : 'cursor-default',
  )
  const content = (
    <>
      <Icon
        className={cn('size-[22px] shrink-0', !active && 'opacity-75')}
        strokeWidth={active ? 2 : 1.8}
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.expandable && (
        <ChevronDown className="size-4 shrink-0 opacity-70" strokeWidth={1.7} />
      )}
    </>
  )

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={classes}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} title="Segera hadir">
      {content}
    </button>
  )
}

function CollapsedNavigation({ pathname }: { pathname: string }) {
  const dashboardActive = isDashboardRoute(pathname)

  return (
    <nav className="relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-3 pb-5">
      <Link
        href="/job-seeker"
        aria-label="Dashboard"
        aria-current={dashboardActive ? 'page' : undefined}
        title="Dashboard"
        className={cn(
          'mb-2 flex size-12 items-center justify-center rounded-none text-[#8E94A4] transition-colors hover:bg-[#F1EFFF] hover:text-[#4138D8]',
          dashboardActive && 'bg-[#EFEEFF] text-[#4138D8]',
        )}
      >
        <House className="size-[22px]" strokeWidth={2} />
      </Link>

      <button
        type="button"
        aria-label="Sakti AI Chatbot"
        title="Sakti AI Chatbot — segera hadir"
        className="flex size-12 items-center justify-center text-[#8E94A4] transition-colors hover:text-[#4138D8]"
      >
        <Bot className="size-[22px]" strokeWidth={1.8} />
      </button>
      <button
        type="button"
        aria-label="Dokumen"
        title="Dokumen — segera hadir"
        className="flex size-12 items-center justify-center text-[#8E94A4] transition-colors hover:text-[#4138D8]"
      >
        <FileText className="size-[21px]" strokeWidth={1.8} />
      </button>

      <div className="my-3 h-px w-12 bg-[#D9D7F4]" />

      {COLLAPSED_ICONS.map((Icon, index) => (
        <button
          key={index}
          type="button"
          aria-label={
            ['Pencarian', 'Eksplorasi pekerjaan', 'Profil', 'Settings'][index]
          }
          title={`${['Pencarian', 'Eksplorasi pekerjaan', 'Profil', 'Settings'][index]} — segera hadir`}
          className="flex size-12 items-center justify-center text-[#8E94A4] transition-colors hover:text-[#4138D8]"
        >
          <Icon className="size-[22px]" strokeWidth={1.8} />
        </button>
      ))}
    </nav>
  )
}

function UserSummary({
  collapsed,
  profile,
}: {
  collapsed: boolean
  profile: UserProfile | null
}) {
  const name = profile?.fullName || 'Pengguna SAKTI'
  const email = profile?.email || 'Akun job seeker'
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <div
      className={cn(
        'relative z-10 flex h-[92px] shrink-0 items-center',
        collapsed ? 'justify-center px-3' : 'gap-3 px-7',
      )}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#211A65] text-xs font-semibold text-white shadow-sm"
        title={collapsed ? `${name} — ${email}` : undefined}
      >
        {initials || 'SA'}
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold leading-5 text-[#23222B]">
            {name}
          </p>
          <p className="truncate text-[11px] leading-4 text-[#9A9AA7]">{email}</p>
        </div>
      )}
    </div>
  )
}

function SidebarOrnament() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox="0 0 280 360"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[360px] w-[280px] text-[#D3D1FA]"
      >
        <path
          d="M-18 329 118 255V137L302 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
    </div>
  )
}

function isDashboardRoute(pathname: string): boolean {
  return (
    pathname === '/job-seeker' ||
    pathname === '/job-seeker/personality' ||
    pathname === '/job-seeker/job-matches'
  )
}
