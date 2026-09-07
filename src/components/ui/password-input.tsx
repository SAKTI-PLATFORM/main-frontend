'use client'

import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-10', className)}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        // Keeps the toggle out of the form's tab order — it's a visibility
        // aid, not a field to tab through between password and submit.
        tabIndex={-1}
        aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-[#989AA6] transition-colors hover:text-[#555867]"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export { PasswordInput }
