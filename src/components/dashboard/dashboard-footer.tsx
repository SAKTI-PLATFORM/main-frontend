import Link from 'next/link'

export function DashboardFooter() {
  return (
    <footer className="flex flex-col gap-2 border-t border-[#ECECF2] bg-[#F7F7FA] px-5 py-5 text-xs text-[#9A9AAB] sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-center gap-2.5">
        <Link href="/landing" className="transition-colors hover:text-[#4138D8]">
          Term of Service
        </Link>
        <span className="text-[#D5D5DE]">|</span>
        <Link href="/landing" className="transition-colors hover:text-[#4138D8]">
          Kebijakan Penggunaan Data
        </Link>
      </div>
      <p>Copyright © {new Date().getFullYear()} SAKTI AI. All rights reserved.</p>
    </footer>
  )
}
