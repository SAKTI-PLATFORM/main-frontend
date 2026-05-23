import type { UserRoleEnum } from '@/types/auth.types'

interface RoleTabProps {
  value: UserRoleEnum
  onChange: (role: UserRoleEnum) => void
}

const tabs: { label: string; value: UserRoleEnum }[] = [
  { label: 'Job Seeker', value: 'JOB_SEEKER' },
  { label: 'Recruiters', value: 'RECRUITER' },
]

export default function RoleTab({ value, onChange }: RoleTabProps) {
  return (
    <div className="flex items-center gap-1 self-center">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`px-5 py-2 rounded text-sm font-semibold transition-colors ${
            value === tab.value
              ? 'bg-[#3535C8] text-white'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
