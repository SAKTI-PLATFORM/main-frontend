import toast from 'react-hot-toast'

const BASE_STYLE: React.CSSProperties = {
  fontWeight: 600,
  borderRadius: '12px',
  fontSize: '14px',
}

/** Lightweight, non-blocking notifications — used for minor / recoverable errors. */
export class Toast {
  static success(message: string) {
    toast.success(message, {
      style: { ...BASE_STYLE, background: '#2701C3', color: '#fff' },
      iconTheme: { primary: '#fff', secondary: '#2701C3' },
      duration: 3000,
    })
  }

  static error(message: string) {
    toast.error(message, {
      style: { ...BASE_STYLE, background: '#ef4444', color: '#fff' },
      iconTheme: { primary: '#fff', secondary: '#ef4444' },
      duration: 4000,
    })
  }

  static info(message: string) {
    toast(message, {
      style: { ...BASE_STYLE, background: '#1f2937', color: '#fff' },
      duration: 3000,
    })
  }

  static loading(message: string): string {
    return toast.loading(message, {
      style: { ...BASE_STYLE, background: '#6d4bff', color: '#fff' },
    })
  }

  static dismiss(id?: string) {
    toast.dismiss(id)
  }
}
