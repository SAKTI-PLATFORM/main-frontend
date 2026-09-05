import { DashboardFooter } from '@/components/dashboard/dashboard-footer'
import { DashboardTopBar } from '@/components/dashboard/dashboard-top-bar'
import { DashboardViewProvider } from '@/components/dashboard/dashboard-view'
import { Sidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardViewProvider>
      <div className="flex min-h-screen bg-[#F7F7FA]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopBar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <DashboardFooter />
        </div>
      </div>
    </DashboardViewProvider>
  )
}
