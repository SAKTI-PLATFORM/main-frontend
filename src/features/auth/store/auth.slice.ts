import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserProfile } from '@/types/auth.types'

interface AuthState {
  token: string | null
  user: UserProfile | null
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload
    },
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    },
  },
})

export const { setToken, setUser, logout } = authSlice.actions
export default authSlice.reducer
