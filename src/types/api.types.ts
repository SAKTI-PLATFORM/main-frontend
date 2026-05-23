export interface ApiResponse<T> {
  message: string
  data: T
  errors: string | null
}
