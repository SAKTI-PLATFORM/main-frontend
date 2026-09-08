'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export type DashboardView = 'summary' | 'psikometri'

interface DashboardViewContextValue {
  view: DashboardView
  setView: (view: DashboardView) => void
  jobMatchesDetailId?: string
  setJobMatchesDetailId: (id?: string) => void
  jobMatchesDetailName?: string
  setJobMatchesDetailName: (name?: string) => void
}

const DashboardViewContext = createContext<DashboardViewContextValue | null>(null)

export function DashboardViewProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [view, setView] = useState<DashboardView>('summary')
  const [jobMatchesDetailId, setJobMatchesDetailId] = useState<string | undefined>()
  const [jobMatchesDetailName, setJobMatchesDetailName] = useState<string | undefined>()
  
  const value = useMemo(() => ({
    view, setView,
    jobMatchesDetailId, setJobMatchesDetailId,
    jobMatchesDetailName, setJobMatchesDetailName
  }), [view, jobMatchesDetailId, jobMatchesDetailName])

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
