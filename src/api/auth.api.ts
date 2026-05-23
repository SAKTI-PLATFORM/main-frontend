import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api.types'
import type {
  AuthToken,
  GoogleAuthRequest,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '@/types/auth.types'

export const authApi = {
  register: (body: RegisterRequest) =>
    api.post<ApiResponse<AuthToken>>('/auth/register', body),

  login: (body: LoginRequest) =>
    api.post<ApiResponse<AuthToken>>('/auth/login', body),

  googleAuth: (body: GoogleAuthRequest) =>
    api.post<ApiResponse<AuthToken>>('/auth/google', body),

  me: () =>
    api.get<ApiResponse<UserProfile>>('/auth/me'),

  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
}
