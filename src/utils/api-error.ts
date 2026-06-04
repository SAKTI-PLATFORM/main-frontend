import axios from 'axios'
import { Alert } from './alert'
import { Toast } from './toast'

/** Error envelope returned by the NestJS AllExceptionsFilter. */
interface BackendErrorBody {
  success?: boolean
  statusCode?: number
  error?: string
  errors?: string[] | null
  message?: string
}

export interface ParsedApiError {
  message: string
  statusCode: number
  isNetwork: boolean
  validationErrors?: string[]
}

/** Normalises any thrown value (axios error, plain Error, unknown) into one shape. */
export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internetmu.',
        statusCode: 0,
        isNetwork: true,
      }
    }
    const data = error.response.data as BackendErrorBody | undefined
    const validationErrors = Array.isArray(data?.errors)
      ? (data.errors as string[])
      : undefined
    const message =
      data?.error ||
      validationErrors?.[0] ||
      data?.message ||
      error.message ||
      'Terjadi kesalahan.'
    return {
      message,
      statusCode: error.response.status,
      isNetwork: false,
      validationErrors,
    }
  }

  if (error instanceof Error) {
    // Locally-thrown validation messages (client-side) are minor by nature.
    return { message: error.message, statusCode: 400, isNetwork: false }
  }

  return { message: 'Terjadi kesalahan tak terduga.', statusCode: 500, isNetwork: false }
}

interface HandleOptions {
  /** Don't surface a 404 (e.g. dashboard handles "belum onboarding" inline). */
  silent404?: boolean
  /** Title for the blocking alert used on major errors. */
  majorTitle?: string
}

/**
 * Surfaces an API error by severity:
 *  - network down or 5xx  → blocking Alert modal (major / disruptive)
 *  - 4xx (validation, not-found, forbidden, conflict) → Toast (minor / recoverable)
 *
 * Returns the parsed error so callers can still branch on statusCode.
 */
export function handleApiError(
  error: unknown,
  options: HandleOptions = {},
): ParsedApiError {
  const parsed = parseApiError(error)

  if (options.silent404 && parsed.statusCode === 404) {
    return parsed
  }

  const isMajor = parsed.isNetwork || parsed.statusCode >= 500
  if (isMajor) {
    Alert.error(options.majorTitle ?? 'Terjadi Kesalahan', parsed.message)
  } else {
    Toast.error(parsed.message)
  }

  return parsed
}
