import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { MathCurveLoader } from '@/components/ui/math-curve-loader'
import { AlertCircle } from 'lucide-react'

export function DashboardLoading() {
  return (
    <div className="grid min-h-[62vh] place-items-center p-6">
      <div className="flex flex-col items-center text-center text-primary">
        <MathCurveLoader size={88} label="Memuat dashboard" />
        <p className="mt-5 text-sm font-semibold text-foreground">Menyiapkan data kariermu</p>
        <p className="mt-1 text-xs text-muted-foreground">SAKTI AI sedang menyelaraskan hasil terbaru.</p>
      </div>
    </div>
  )
}

export function DashboardError() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center gap-4 p-8">
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Dashboard belum dapat dimuat</AlertTitle>
        <AlertDescription>
          Buka onboarding untuk memulihkan progress atau memulai sesi baru.
        </AlertDescription>
      </Alert>
      <Link href="/job-seeker/onboarding" className={buttonVariants()}>
        Buka Onboarding
      </Link>
    </div>
  )
}
