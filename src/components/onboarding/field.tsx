import { Label } from '@/components/ui/label'

interface FieldProps {
  label: string
  description?: string
  required?: boolean
  children: React.ReactNode
}

/** Label + optional helper text wrapper shared by every onboarding field. */
export function Field({ label, description, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {children}
    </div>
  )
}
