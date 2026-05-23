'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authApi } from '@/api/auth.api'
import AuthLeftPanel from '@/components/auth/auth-left-panel'
import GoogleLoginButton from '@/components/auth/google-login-button'
import RoleTab from '@/components/auth/role-tab'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/constants'
import { setToken, setUser } from '@/features/auth'
import { useAppDispatch } from '@/hooks/redux'
import type { UserRoleEnum } from '@/types/auth.types'

const hasGoogle = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [role, setRole] = useState<UserRoleEnum>('JOB_SEEKER')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
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
      const res = await authApi.register({
        ...form,
        confirmationPassword: form.password,
        role,
      })
      await redirectByRole(res.data.data.token)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSuccess(accessToken: string) {
    setLoading(true)
    try {
      const res = await authApi.googleAuth({ idToken: accessToken, role })
      await redirectByRole(res.data.data.token)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Google sign up gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />

      <div className="flex flex-1 flex-col justify-center bg-white px-14 py-12">
        <div className="w-full max-w-[480px]">

          <div className="flex mb-6">
            <RoleTab value={role} onChange={setRole} />
          </div>

          <h1 className="text-4xl font-bold text-zinc-900 leading-tight mb-7">
            Get More Opportunities
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName" className="text-sm font-semibold text-zinc-800">
                Full name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="h-12 px-4 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-zinc-800">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
                className="h-12 px-4 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-zinc-800">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={8}
                className="h-12 px-4 text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-bold"
            >
              {loading ? 'Loading...' : 'Continue'}
            </Button>
          </form>

          <p className="text-sm text-zinc-500 text-center mt-5">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
              Login
            </Link>
          </p>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-sm text-zinc-400 whitespace-nowrap">Or sign up with email</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {hasGoogle && (
            <GoogleLoginButton
              label="Sign Up with Google"
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign up gagal. Coba lagi.')}
              disabled={loading}
            />
          )}

          <p className="text-xs text-zinc-400 leading-relaxed mt-5">
            By clicking &apos;Continue&apos;, you acknowledge that you have read and accept the{' '}
            <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{' '}
            and{' '}
            <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
