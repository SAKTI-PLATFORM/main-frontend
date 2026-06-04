'use client'

import { useEffect, useState } from 'react'
import { seekerApi } from '@/api/seeker.api'
import { Input } from '@/components/ui/input'
import {
  COMPANY_TYPE_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS,
} from '@/features/onboarding/constants'
import type {
  CompanyType,
  JobType,
  RoleOption,
  WorkMode,
} from '@/types/seeker.types'
import { Field } from '../field'
import { OptionSelect } from '../option-select'
import { OptionToggleGroup } from '../option-toggle-group'

export interface VisionState {
  targetRole: string
  workModes: WorkMode[]
  salaryMin?: number
  salaryMax?: number
  companyTypes: CompanyType[]
  jobTypes: JobType[]
}

interface Props {
  value: VisionState
  onChange: (patch: Partial<VisionState>) => void
}

function parseAmount(raw: string): number | undefined {
  const value = Number(raw)
  return raw === '' || Number.isNaN(value) ? undefined : value
}

export function VisionStep({ value, onChange }: Props) {
  const [roles, setRoles] = useState<RoleOption[]>([])

  useEffect(() => {
    let active = true
    seekerApi
      .roles()
      .then((res) => {
        if (active) setRoles(res.data.data)
      })
      .catch(() => {
        // Service down → keep roles empty and fall back to free-text input.
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <Field
        label="Target Role"
        description="Pilih peran yang kamu tuju — menentukan benchmark, skill gap & lowongan"
      >
        {roles.length > 0 ? (
          <OptionSelect
            options={roles.map((role) => ({ value: role.name, label: role.name }))}
            value={value.targetRole || undefined}
            onChange={(targetRole) => onChange({ targetRole: targetRole ?? '' })}
            placeholder="Pilih target role"
          />
        ) : (
          <Input
            value={value.targetRole}
            placeholder="Mis. Data Scientist"
            onChange={(event) => onChange({ targetRole: event.target.value })}
          />
        )}
      </Field>

      <Field label="Mode Kerja">
        <OptionToggleGroup
          multiple
          options={WORK_MODE_OPTIONS}
          value={value.workModes}
          onChange={(workModes) => onChange({ workModes })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Gaji Minimum (Rp)">
          <Input
            type="number"
            inputMode="numeric"
            value={value.salaryMin ?? ''}
            placeholder="1000000"
            onChange={(event) => onChange({ salaryMin: parseAmount(event.target.value) })}
          />
        </Field>
        <Field label="Gaji Maksimum (Rp)">
          <Input
            type="number"
            inputMode="numeric"
            value={value.salaryMax ?? ''}
            placeholder="15000000"
            onChange={(event) => onChange({ salaryMax: parseAmount(event.target.value) })}
          />
        </Field>
      </div>

      <Field label="Tipe Perusahaan">
        <OptionToggleGroup
          multiple
          columns={3}
          options={COMPANY_TYPE_OPTIONS}
          value={value.companyTypes}
          onChange={(companyTypes) => onChange({ companyTypes })}
        />
      </Field>

      <Field label="Tipe Pekerjaan">
        <OptionToggleGroup
          multiple
          columns={3}
          options={JOB_TYPE_OPTIONS}
          value={value.jobTypes}
          onChange={(jobTypes) => onChange({ jobTypes })}
        />
      </Field>
    </div>
  )
}
