'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authApi } from '@/api/auth.api'
import { AuthDivider } from '@/components/auth/auth-divider'
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
import { handleApiError } from '@/utils/api-error'
import { Toast } from '@/utils/toast'

const hasGoogle = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const inputClassName =
  'h-[46px] rounded-none border-[#D8D8E3] px-4 text-sm shadow-none placeholder:text-[#B1B3C1] focus-visible:border-primary'

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [role, setRole] = useState<UserRoleEnum>('JOB_SEEKER')
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function redirectByRole(token: string) {
    dispatch(setToken(token))
    const profile = await authApi.me()
    dispatch(setUser(profile.data.data))
    const userRole = profile.data.data.roles[0]
    router.replace(
      userRole === 'JOB_SEEKER' ? ROUTES.JOB_SEEKER : ROUTES.RECRUITER,
    )
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await authApi.register({
        ...form,
        confirmationPassword: form.password,
        role,
      })
      await redirectByRole(response.data.data.token)
    } catch (error: unknown) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSuccess(accessToken: string) {
    setLoading(true)
    try {
      const response = await authApi.googleAuth({ idToken: accessToken, role })
      await redirectByRole(response.data.data.token)
    } catch (error: unknown) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen bg-[#FCFCFD]">
      <AuthLeftPanel />

      <section className="flex min-w-0 flex-1 items-center justify-center px-6 py-8 sm:px-10 lg:px-12">
        <div className="w-full max-w-[384px]">
          <div className="flex justify-center">
            <RoleTab value={role} onChange={setRole} />
          </div>

          <h1 className="mt-3 text-center text-[35px] font-semibold leading-tight tracking-[-0.025em] text-[#242428]">
            Get More Opportunities
          </h1>

          <div className="mt-3.5">
            <GoogleLoginButton
              label="Sign Up with Google"
              onSuccess={handleGoogleSuccess}
              onError={() =>
                Toast.error(
                  hasGoogle
                    ? 'Google sign up gagal. Coba lagi.'
                    : 'Google sign up belum dikonfigurasi.',
                )
              }
              disabled={loading}
              enabled={hasGoogle}
            />
          </div>

          <div className="my-3.5">
            <AuthDivider label="Or sign up with email" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AuthField label="Full name" htmlFor="fullName">
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={inputClassName}
              />
            </AuthField>

            <AuthField label="Email Address" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
                className={inputClassName}
              />
            </AuthField>

            <AuthField label="Password" htmlFor="password">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={8}
                className={inputClassName}
              />
            </AuthField>

            <Button
              type="submit"
              disabled={loading}
              className="h-[43px] w-full rounded-none text-sm font-bold"
            >
              {loading ? 'Loading...' : 'Continue'}
            </Button>
          </form>

          <p className="mt-3.5 text-sm text-[#666872]">
            Already have an account?{' '}
            <Link
              href={ROUTES.LOGIN}
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="mt-4 text-xs leading-[1.55] text-[#989AA6]">
            By clicking &apos;Continue&apos;, you acknowledge that you have read
            and accept the{' '}
            <a href="#terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" className="text-primary hover:underline">
              Privacy Policy.
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}

function AuthField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-[#555867]">
        {label}
      </Label>
      {children}
    </div>
  )
}
