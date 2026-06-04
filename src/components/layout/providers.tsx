'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { store } from '@/store'

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export default function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <Provider store={store}>
      {children}
      <Toaster position="top-center" />
    </Provider>
  )

  if (!googleClientId) return content

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {content}
    </GoogleOAuthProvider>
  )
}
