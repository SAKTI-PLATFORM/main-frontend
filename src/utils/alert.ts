import Swal from 'sweetalert2'

const PRIMARY = '#2701C3'
const DANGER = '#ef4444'

const BASE = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: PRIMARY,
} as const

/** Blocking modal dialogs — used for major / disruptive errors and confirmations. */
export class Alert {
  static success(title: string, text?: string) {
    return Swal.fire({
      ...BASE,
      icon: 'success',
      title,
      text,
      timer: 3500,
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  static error(title: string, text?: string) {
    return Swal.fire({ ...BASE, icon: 'error', title, text })
  }

  static warning(title: string, text?: string) {
    return Swal.fire({ ...BASE, icon: 'warning', title, text })
  }

  static info(title: string, text?: string) {
    return Swal.fire({ ...BASE, icon: 'info', title, text })
  }

  static async confirm(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      ...BASE,
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      cancelButtonColor: DANGER,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    })
    return result.isConfirmed
  }
}
