'use client'

import {
  KNOWLEDGE_OPTIONS,
  SOFT_SKILL_OPTIONS,
  TOOL_OPTIONS,
} from '@/features/onboarding/constants'
import type { ToolsExperience } from '@/types/seeker.types'
import { ExperienceSlider } from '../experience-slider'
import { Field } from '../field'
import { MultiSelect } from '../multi-select'
import { RankedSoftSkills } from '../ranked-soft-skills'

/** A tool plus how long the seeker has used it (key-value). */
export interface ToolEntry {
  name: string
  experience?: ToolsExperience
}

export interface ExpertiseState {
  tools: ToolEntry[]
  knowledgeAreas: string[]
  softSkillsRanked: string[]
}

interface Props {
  value: ExpertiseState
  onChange: (patch: Partial<ExpertiseState>) => void
}

const toolLabel = (name: string) =>
  TOOL_OPTIONS.find((o) => o.value === name)?.label ?? name

export function ExpertiseStep({ value, onChange }: Props) {
  const tools = value.tools ?? []

  const setToolNames = (names: string[]) => {
    // Preserve existing per-tool experience; new tools start without one.
    const next = names.map(
      (name) => tools.find((t) => t.name === name) ?? { name },
    )
    onChange({ tools: next })
  }

  const setToolExperience = (name: string, experience: ToolsExperience) => {
    onChange({
      tools: tools.map((t) => (t.name === name ? { ...t, experience } : t)),
    })
  }

  return (
    <div className="space-y-6">
      <Field label="Tools apa yang pernah kamu gunakan secara profesional atau akademis?">
        <MultiSelect
          options={TOOL_OPTIONS}
          selected={tools.map((t) => t.name)}
          onChange={setToolNames}
          placeholder="Pilih tools yang kamu kuasai"
        />
      </Field>

      {tools.length > 0 && (
        <Field label="Sudah berapa lama waktu menggunakan tools tersebut?">
          <div className="space-y-5">
            {tools.map((tool) => (
              <div key={tool.name}>
                <p className="mb-1 text-sm font-medium capitalize">
                  {toolLabel(tool.name)}
                </p>
                <ExperienceSlider
                  value={tool.experience}
                  onChange={(experience) =>
                    setToolExperience(tool.name, experience)
                  }
                />
              </div>
            ))}
          </div>
        </Field>
      )}

      <Field label="Di bidang pengetahuan apa kamu merasa paling kompeten?">
        <MultiSelect
          options={KNOWLEDGE_OPTIONS}
          selected={value.knowledgeAreas}
          onChange={(knowledgeAreas) => onChange({ knowledgeAreas })}
          placeholder="Pilih bidang pengetahuan"
        />
      </Field>

      <Field
        label="Soft skill apa yang paling sering kamu andalkan di pekerjaan/organisasi?"
        description="Pilih dan urutkan 5 soft skill yang paling menggambarkan dirimu"
      >
        <RankedSoftSkills
          options={SOFT_SKILL_OPTIONS}
          value={value.softSkillsRanked}
          onChange={(softSkillsRanked) => onChange({ softSkillsRanked })}
        />
      </Field>
    </div>
  )
}
