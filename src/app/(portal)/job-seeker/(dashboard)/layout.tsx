import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardNavigation } from '@/components/dashboard/dashboard-navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-[#F7F7FA]">
        <div className="px-4 pt-5 sm:px-6">
          <div className="mx-auto max-w-[1540px]">
            <DashboardNavigation />
          </div>
        </div>
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
