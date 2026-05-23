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
    <div className="flex items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`px-5 py-2 text-sm font-semibold rounded transition-colors ${
            value === tab.value
              ? 'bg-[#3535C8] text-white'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
