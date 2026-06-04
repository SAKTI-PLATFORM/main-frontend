'use client'

import { Input } from '@/components/ui/input'
import {
  EDUCATION_LEVEL_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  FIELD_OPTIONS,
  GENDER_OPTIONS,
} from '@/features/onboarding/constants'
import type { FoundationPayload } from '@/types/seeker.types'
import { Field } from '../field'
import { OptionSelect } from '../option-select'

export type FoundationState = Partial<FoundationPayload>

interface Props {
  value: FoundationState
  onChange: (patch: FoundationState) => void
}

export function FoundationStep({ value, onChange }: Props) {
  return (
    <div className="space-y-6 ">
      {/* Personal Details */}
      <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-700">Personal Details</p>

        <Field label="Phone Number" required>
          <Input
            type="tel"
            inputMode="tel"
            placeholder="+62 812 345 678"
            value={value.phoneNumber ?? ''}
            onChange={(event) =>
              onChange({ phoneNumber: event.target.value || undefined })
            }
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date of Birth" required>
            <Input
              type="date"
              value={value.dob ?? ''}
              onChange={(event) => onChange({ dob: event.target.value || undefined })}
            />
          </Field>

          <Field label="Gender" required>
            <OptionSelect
              options={GENDER_OPTIONS}
              value={value.gender}
              onChange={(gender) => onChange({ gender })}
              placeholder="Pilih gender"
            />
          </Field>
        </div>
      </div>

      {/* Foundation questions */}
      <Field label="Apa status pekerjaan kamu saat ini?">
        <OptionSelect
          options={EMPLOYMENT_STATUS_OPTIONS}
          value={value.employmentStatus}
          onChange={(employmentStatus) => onChange({ employmentStatus })}
          placeholder="Pilih status pekerjaan"
        />
      </Field>

      <Field label="Apa latar belakang pendidikan terakhirmu?">
        <OptionSelect
          options={EDUCATION_LEVEL_OPTIONS}
          value={value.educationLevel}
          onChange={(educationLevel) => onChange({ educationLevel })}
          placeholder="Pilih jenjang pendidikan"
        />
      </Field>

      <Field label="Di bidang apa kamu bekerja atau belajar selama ini?">
        <OptionSelect
          options={FIELD_OPTIONS}
          value={value.field}
          onChange={(field) => onChange({ field })}
          placeholder="Pilih bidang"
        />
      </Field>
    </div>
  )
}
