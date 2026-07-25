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
    <div className="inline-flex items-stretch bg-[#F7F7FA]">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`h-[31px] px-3 text-sm font-medium transition-colors ${
            value === tab.value
              ? 'bg-[#2701C3] text-white'
              : 'text-[#2701C3] hover:bg-[#EFEDFF]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
