'use client'

import {
  ArrowUpRight,
  Bot,
  ChevronRight,
  House,
  LogOut,
  PanelLeftClose,
  Search,
  Settings,
  Waypoints,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { authApi } from '@/api/auth.api'
import { setUser, useLogout } from '@/features/auth'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { cn } from '@/lib/utils'
import type { UserProfile } from '@/types/auth.types'

type NavigationItem = {
  label: string
  icon: typeof House
  href?: string
  chevron?: boolean
}

const NAVIGATION: Array<{ label: string; items: NavigationItem[] }> = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/job-seeker', icon: House },
      { label: 'Sakti Chatbot', icon: Bot, chevron: true },
    ],
  },
  {
    label: 'Eksplorasi',
    items: [
      {
        label: 'Career Forecast',
        href: '/job-seeker/job-matches',
        icon: Search,
        chevron: true,
      },
      {
        label: 'Roadmap Belajar',
        href: '/job-seeker/learning-paths',
        icon: Waypoints,
        chevron: true,
      },
    ],
  },
]

const ALL_ITEMS = NAVIGATION.flatMap((group) => group.items)
const STORAGE_KEY = 'sakti:sidebar-collapsed'
const STORAGE_EVENT = 'sakti:sidebar-collapsed-change'

function subscribeCollapsed(onChange: () => void): () => void {
  window.addEventListener(STORAGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(STORAGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/** localStorage-backed collapse flag; SSR-safe and synced across tabs. */
export function useCollapsed(): [boolean, (value: boolean) => void] {
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsed,
    () => false,
  )
  const setCollapsed = useCallback((value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
    } catch {
      /* private mode / storage disabled */
    }
    window.dispatchEvent(new Event(STORAGE_EVENT))
  }, [])
  return [collapsed, setCollapsed]
}

export function Sidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.auth.user)
  const [collapsed, setCollapsed] = useCollapsed()

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
        'sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-[#ECECF2] bg-white transition-[width] duration-300 md:flex',
        collapsed ? 'w-[76px]' : 'w-[264px]',
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-[#F0F0F5]',
          collapsed ? 'justify-center px-3' : 'justify-between gap-2 px-6',
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Buka sidebar"
            title="Buka sidebar"
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-[#F4F3FB]"
          >
            <Image
              src="/logo-mark.png"
              alt="SAKTI AI"
              width={512}
              height={512}
              className="size-8"
              priority
            />
          </button>
        ) : (
          <>
            <Image
              src="/logo.png"
              alt="SAKTI AI"
              width={584}
              height={211}
              className="h-9 w-auto"
              priority
            />
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Tutup sidebar"
              title="Tutup sidebar"
              className="flex size-7 items-center justify-center rounded-md border border-[#E4E3F0] text-[#8E8E9C] transition-colors hover:bg-[#F4F3FB] hover:text-[#4138D8]"
            >
              <PanelLeftClose className="size-4" />
            </button>
          </>
        )}
      </div>

      {collapsed ? (
        <nav className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto py-4">
          {ALL_ITEMS.map((item) => (
            <CollapsedRow key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>
      ) : (
        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
          {NAVIGATION.map((group) => (
            <div key={group.label} className="py-3">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9A9AAB]">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavigationRow
                    key={item.label}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      )}

      {collapsed ? (
        <div className="flex flex-col items-center gap-3 pb-4">
          <button
            type="button"
            title="Mulai Subscribe — segera hadir"
            aria-label="Mulai Subscribe"
            className="flex size-10 items-center justify-center rounded-lg bg-[#3E1DD1] text-white transition-colors hover:bg-[#3315B8]"
          >
            <Zap className="size-4 fill-current" />
          </button>
          <AccountMenu profile={profile} collapsed />
        </div>
      ) : (
        <>
          <div className="px-4 pb-3">
            <SubscriptionCard />
          </div>
          <AccountMenu profile={profile} />
        </>
      )}
    </aside>
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
  const active = item.href ? isActive(pathname, item.href) : false
  const classes = cn(
    'flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[15px] transition-colors',
    active
      ? 'bg-[#EFEEFF] font-semibold text-[#4138D8]'
      : 'font-medium text-[#6E6E82] hover:bg-[#F4F3FB] hover:text-[#4138D8]',
    !item.href && 'cursor-default',
  )
  const content = (
    <>
      <Icon
        className={cn('size-5 shrink-0', !active && 'text-[#9293A2]')}
        strokeWidth={active ? 2.2 : 1.9}
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.chevron && (
        <ChevronRight className="size-4 shrink-0 text-[#BEBECB]" strokeWidth={1.9} />
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

function CollapsedRow({
  item,
  pathname,
}: {
  item: NavigationItem
  pathname: string
}) {
  const Icon = item.icon
  const active = item.href ? isActive(pathname, item.href) : false
  const classes = cn(
    'flex size-10 items-center justify-center rounded-lg transition-colors',
    active
      ? 'bg-[#EFEEFF] text-[#4138D8]'
      : 'text-[#9293A2] hover:bg-[#F4F3FB] hover:text-[#4138D8]',
  )
  const icon = <Icon className="size-5" strokeWidth={active ? 2.2 : 1.9} />

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={classes}
        title={item.label}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
      >
        {icon}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      title={`${item.label} — segera hadir`}
      aria-label={item.label}
    >
      {icon}
    </button>
  )
}

function SubscriptionCard() {
  return (
    <div className="rounded-lg bg-[#EFEEFF] p-4">
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#4138D8]">
        <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
        Basic Subscriptions
      </span>
      <p className="mt-2.5 text-[12px] leading-5 text-[#6B6B80]">
        Kamu saat ini berada pada{' '}
        <span className="font-semibold text-[#3B3B4C]">basic subscriptions</span>,
        tingkatkan langganan untuk dapatkan fitur penuh.
      </p>
      <button
        type="button"
        title="Mulai Subscribe — segera hadir"
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3E1DD1] px-3 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#3315B8]"
      >
        <Zap className="size-4 fill-current" />
        Mulai Subscribe!
      </button>
    </div>
  )
}

/** Click the account row to get a small "Settings / Keluar" menu. */
function AccountMenu({
  profile,
  collapsed,
}: {
  profile: UserProfile | null
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const logout = useLogout()
  const name = profile?.fullName || 'Pengguna SAKTI'
  const email = profile?.email || 'Akun job seeker'

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={containerRef}
      className={cn('relative', !collapsed && 'border-t border-[#F0F0F5] px-4 py-2')}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={collapsed ? `Akun ${name}` : undefined}
        className={cn(
          'flex items-center rounded-lg text-left transition-colors hover:bg-[#F4F3FB]',
          collapsed ? 'justify-center p-0.5' : 'w-full gap-3 px-1 py-2',
        )}
      >
        <Avatar profile={profile} />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-5 text-[#23222B]">
              {name}
            </p>
            <p className="truncate text-[11px] leading-4 text-[#9A9AA7]">{email}</p>
          </div>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute bottom-full z-40 mb-2 overflow-hidden rounded-lg border border-[#ECECF2] bg-white py-1.5 shadow-lg shadow-black/5',
            collapsed ? 'left-0 w-56' : 'inset-x-4',
          )}
        >
          <div className="border-b border-[#F0F0F5] px-4 py-3">
            <p className="truncate text-[13px] font-semibold text-[#23222B]">{name}</p>
            <p className="truncate text-[11px] text-[#9A9AA7]">{email}</p>
          </div>
          <Link
            href="/job-seeker/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-[#4B4B5C] transition-colors hover:bg-[#F4F3FB] hover:text-[#4138D8]"
          >
            <Settings className="size-4" />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px] font-medium text-rose-600 transition-colors hover:bg-rose-50"
          >
            <LogOut className="size-4" />
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}

export function Avatar({ profile }: { profile: UserProfile | null }) {
  const name = profile?.fullName || 'Pengguna SAKTI'
  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'SA'

  if (profile?.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.photoUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className="size-9 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#211A65] text-[11px] font-semibold text-white">
      {initials}
    </div>
  )
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/job-seeker') return pathname === '/job-seeker'
  return pathname === href || pathname.startsWith(`${href}/`)
}
