'use client'

import { ArrowUpRight, LogOut, ShieldAlert, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { authApi } from '@/api/auth.api'
import { DashboardLoading } from '@/components/dashboard/dashboard-status'
import { Avatar, useCollapsed } from '@/components/dashboard/sidebar'
import { setUser, useLogout } from '@/features/auth'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.auth.user)
  const logout = useLogout()
  const [sidebarCollapsed, setSidebarCollapsed] = useCollapsed()

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

  if (!profile) return <DashboardLoading />

  return (
    <div className="px-5 py-6 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <section>
          <h1 className="font-heading text-[26px] leading-[39px] font-bold tracking-[-0.01em] text-[#1F1F27] sm:text-[28px] sm:leading-[42px]">
            Pengaturan
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#6C6C7A]">
            Kelola akun, langganan, dan preferensi tampilanmu di SAKTI AI.
          </p>
        </section>

        <section className="rounded-lg bg-white p-5 ring-1 ring-[#ECECF2] sm:p-6">
          <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#20202A]">
            Akun
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <Avatar profile={profile} />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-[#23222B]">
                {profile.fullName}
              </p>
              <p className="truncate text-sm text-[#9A9AA7]">{profile.email}</p>
            </div>
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoField label="Nomor telepon" value={profile.phoneNumber} />
            <InfoField label="Domisili" value={profile.domicile} />
            <InfoField
              label="Headline profesional"
              value={profile.professionalHeadline}
            />
            <InfoField
              label="LinkedIn"
              value={profile.linkedinUrl}
              href={profile.linkedinUrl ? normalizeUrl(profile.linkedinUrl) : undefined}
            />
          </dl>

          <p className="mt-5 rounded-lg bg-[#FAFAFC] p-3.5 text-xs leading-5 text-[#8A8A98]">
            Bergabung sejak {formatDate(profile.createdAt)}. Untuk mengubah data di
            atas, lengkapi kembali identitas di{' '}
            <Link
              href="/job-seeker/onboarding"
              className="font-semibold text-[#4138D8] hover:underline"
            >
              halaman onboarding
            </Link>
            .
          </p>
        </section>

        <section className="rounded-lg bg-white p-5 ring-1 ring-[#ECECF2] sm:p-6">
          <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#20202A]">
            Langganan
          </h2>
          <div className="mt-4 rounded-lg bg-[#EFEEFF] p-4">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#4138D8]">
              <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
              Basic Subscriptions
            </span>
            <p className="mt-2.5 text-[13px] leading-5 text-[#6B6B80]">
              Kamu saat ini berada pada{' '}
              <span className="font-semibold text-[#3B3B4C]">basic subscriptions</span>,
              tingkatkan langganan untuk dapatkan fitur penuh.
            </p>
            <button
              type="button"
              title="Mulai Subscribe — segera hadir"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#3E1DD1] px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#3315B8]"
            >
              <Zap className="size-4 fill-current" />
              Mulai Subscribe!
            </button>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 ring-1 ring-[#ECECF2] sm:p-6">
          <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#20202A]">
            Akun &amp; Keamanan
          </h2>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#2F2F3A]">Keluar dari akun</p>
              <p className="mt-0.5 text-xs text-[#9A9AAB]">
                Kamu akan diarahkan kembali ke halaman login.
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] font-semibold text-rose-600 transition-colors hover:bg-rose-100"
            >
              <LogOut className="size-4" />
              Keluar
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function InfoField({
  label,
  value,
  href,
}: {
  label: string
  value?: string | null
  href?: string
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[#9A9AAB]">{label}</dt>
      <dd className="mt-1 truncate text-sm text-[#2F2F3A]">
        {value ? (
          href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#4138D8] hover:underline"
            >
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-[#B4B4C2]">Belum diisi</span>
        )}
      </dd>
    </div>
  )
}

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

function Switch({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean
  onCheckedChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'flex h-6 w-10 shrink-0 items-center rounded-full px-1 transition-colors',
        checked ? 'bg-[#4138D8]' : 'bg-[#E4E3F0]',
      )}
    >
      <span
        className={cn(
          'size-4 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  )
}
