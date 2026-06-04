import { Bell, Search } from 'lucide-react'

/** Slim top bar: search + notifications + avatar (visual chrome, matches mockup). */
export function TopBar() {
  return (
    <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-3">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <button
        type="button"
        aria-label="Notifications"
        className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Bell className="size-5" />
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" />
      </button>
      <div className="size-8 rounded-full bg-primary/10" />
    </header>
  )
}
