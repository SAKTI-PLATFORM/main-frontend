import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/top-bar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
