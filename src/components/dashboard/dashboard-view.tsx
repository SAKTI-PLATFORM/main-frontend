'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export type DashboardView = 'summary' | 'psikometri'

interface DashboardViewContextValue {
  view: DashboardView
  setView: (view: DashboardView) => void
}

const DashboardViewContext = createContext<DashboardViewContextValue | null>(null)

export function DashboardViewProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [view, setView] = useState<DashboardView>('summary')
  const value = useMemo(() => ({ view, setView }), [view])

  return (
    <DashboardViewContext.Provider value={value}>
      {children}
    </DashboardViewContext.Provider>
  )
}

export function useDashboardView(): DashboardViewContextValue {
  const context = useContext(DashboardViewContext)
  if (!context) {
    throw new Error('useDashboardView must be used within a DashboardViewProvider')
  }
  return context
}
