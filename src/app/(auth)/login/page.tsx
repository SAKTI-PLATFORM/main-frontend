'use client'

import { useGoogleLogin } from '@react-oauth/google'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authApi } from '@/api/auth.api'
import AuthLeftPanel from '@/components/auth/auth-left-panel'
import RoleTab from '@/components/auth/role-tab'
import { ROUTES } from '@/constants'
import { setToken, setUser } from '@/features/auth'
import { useAppDispatch } from '@/hooks/redux'
import type { UserRoleEnum } from '@/types/auth.types'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [role, setRole] = useState<UserRoleEnum>('JOB_SEEKER')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function redirectByRole(token: string) {
    dispatch(setToken(token))
    const profile = await authApi.me()
    dispatch(setUser(profile.data.data))
    const userRole = profile.data.data.roles[0]
    router.replace(userRole === 'JOB_SEEKER' ? ROUTES.JOB_SEEKER : ROUTES.RECRUITER)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(form)
      await redirectByRole(res.data.data.token)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setLoading(true)
      try {
        const res = await authApi.googleAuth({ idToken: access_token, role })
        await redirectByRole(res.data.data.token)
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        setError(msg ?? 'Google login gagal. Coba lagi.')
      } finally {
        setLoading(false)
      }
    },
    onError: () => setError('Google login gagal. Coba lagi.'),
  })

  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md flex flex-col gap-6">
          <RoleTab value={role} onChange={setRole} />

          <div>
            <h1 className="text-3xl font-bold text-zinc-900 text-center">
              Welcome Back
            </h1>
          </div>

          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full border border-zinc-300 rounded py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            <GoogleIcon />
            Sign In with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-sm text-zinc-400">Or sign in with email</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
                className="border border-zinc-300 rounded px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3535C8] focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="border border-zinc-300 rounded px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3535C8] focus:border-transparent transition"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3535C8] hover:bg-[#2c2cad] text-white font-semibold py-3 rounded transition-colors disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-zinc-600 text-center">
            Don&apos;t have an account?{' '}
            <Link href={ROUTES.REGISTER} className="text-[#3535C8] font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}
