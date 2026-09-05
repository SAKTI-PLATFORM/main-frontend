'use client'

import { useCallback } from 'react'
import { useAppDispatch } from '@/hooks/redux'
import { logout } from './store/auth.slice'

/**
 * Clears the session and does a hard redirect to /login — mirrors how the
 * axios 401 interceptor already bounces an expired session, so a stale
 * cache can never leak into the next person's session on this tab/device.
 */
export function useLogout(): () => void {
  const dispatch = useAppDispatch()

  return useCallback(() => {
    dispatch(logout())
    window.location.href = '/login'
  }, [dispatch])
}
