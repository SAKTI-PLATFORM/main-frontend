export type UserRoleEnum = 'JOB_SEEKER' | 'RECRUITER'

export interface AuthToken {
  token: string
}

export interface UserProfile {
  userId: string
  fullName: string
  email: string
  phoneNumber?: string | null
  photoUrl?: string | null
  domicile?: string | null
  professionalHeadline?: string | null
  linkedinUrl?: string | null
  profileSummary?: string | null
  roles: UserRoleEnum[]
  createdAt: string
  updatedAt: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  confirmationPassword: string
  role: UserRoleEnum
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GoogleAuthRequest {
  idToken: string
  role?: UserRoleEnum
}
