import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Expired/invalid session → bounce to login, but NOT while already on an
    // auth page (there a 401 just means wrong credentials → surfaced as a toast).
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname
      const onAuthPage = path.startsWith('/login') || path.startsWith('/register')
      if (!onAuthPage) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
