import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

export function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-4 py-6">
            <Skeleton className="mx-auto size-20 rounded-full" />
            <Skeleton className="mx-auto h-5 w-40" />
            <Skeleton className="mx-auto h-4 w-28" />
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-32" />
          ))}
        </div>
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
