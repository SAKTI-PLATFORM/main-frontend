export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[#E2E3EA]" />
      <span className="whitespace-nowrap text-[13px] text-[#9A9CA8]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#E2E3EA]" />
    </div>
  )
}
