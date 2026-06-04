import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export function DashboardLoading() {
  return (
    <p className="p-8 text-sm text-muted-foreground">Memuat dashboard…</p>
  )
}

export function DashboardError() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Profilmu belum lengkap. Selesaikan onboarding untuk melihat dashboard.
      </p>
      <Link href="/job-seeker/onboarding" className={buttonVariants()}>
        Mulai Onboarding
      </Link>
    </div>
  )
}
