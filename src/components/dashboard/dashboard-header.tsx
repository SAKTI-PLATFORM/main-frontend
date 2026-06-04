import { ViewToggle } from './view-toggle'

interface DashboardHeaderProps {
  name: string
}

export function DashboardHeader({ name }: DashboardHeaderProps) {
  const firstName = name.trim().split(/\s+/)[0] || 'Kandidat'
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold tracking-tight">{firstName}&apos;s Dashboard</h1>
      <ViewToggle />
    </div>
  )
}
