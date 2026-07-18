'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { seekerApi } from '@/api/seeker.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  CreateCertificationPayload,
  CreateEducationPayload,
  CreateExperiencePayload,
  CreateProjectPayload,
  CreateSkillPayload,
  EducationLevel,
  ParseCvResponse,
} from '@/types/seeker.types'
import { handleApiError } from '@/utils/api-error'
import { Toast } from '@/utils/toast'

const educationLevels: EducationLevel[] = ['SMA', 'D3', 'S1', 'S2', 'S3']

const emptyEducation: CreateEducationPayload = {
  degree: '',
  institution: '',
  major: '',
}

const emptyExperience: CreateExperiencePayload = {
  title: '',
  organization: '',
  experienceType: 'WORK',
}

const emptyProject: CreateProjectPayload = {
  projectName: '',
  description: '',
  toolsUsed: '',
}

const emptyCertification: CreateCertificationPayload = {
  certificationName: '',
  issuer: '',
}

const emptySkill: CreateSkillPayload = {
  detectedText: '',
  evidenceSource: 'manual',
}

export function OnboardingWizard() {
  const router = useRouter()
  const [parsing, setParsing] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [parseResult, setParseResult] = useState<ParseCvResponse | null>(null)
  const [cvForm, setCvForm] = useState({
    fileName: 'cv.txt',
    fileType: 'text/plain',
    fileUrl: 'manual://cv-text',
    rawText: '',
  })
  const [education, setEducation] = useState<CreateEducationPayload>(emptyEducation)
  const [experience, setExperience] = useState<CreateExperiencePayload>(emptyExperience)
  const [project, setProject] = useState<CreateProjectPayload>(emptyProject)
  const [certification, setCertification] =
    useState<CreateCertificationPayload>(emptyCertification)
  const [skill, setSkill] = useState<CreateSkillPayload>(emptySkill)

  async function submitCv(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!cvForm.rawText.trim()) {
      Toast.error('Paste isi text CV dulu.')
      return
    }

    setParsing(true)
    try {
      const response = await seekerApi.parseCv({
        ...cvForm,
        rawText: cvForm.rawText.trim(),
      })
      setParseResult(response.data.data)
      window.localStorage.setItem('sakti:onboarding:cvParsed', 'true')
      Toast.success('CV berhasil diparsing dan disimpan.')
    } catch (error) {
      handleApiError(error)
    } finally {
      setParsing(false)
    }
  }

  async function submitManual<T>(
    key: string,
    action: () => Promise<T>,
    afterSave: () => void,
  ) {
    setSaving(key)
    try {
      await action()
      afterSave()
      window.localStorage.setItem('sakti:onboarding:cvParsed', 'true')
      Toast.success('Data berhasil disimpan.')
    } catch (error) {
      handleApiError(error)
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center border-b border-gray-100 px-6 py-4">
        <Image
          src="/logo-color.png"
          alt="SAKTI Ai"
          width={120}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-primary">Tahap 01</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Parse CV untuk memulai onboarding
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
            Paste text CV yang sudah diekstrak dari PDF/DOCX. Backend akan
            memanggil SAKTI-AI, lalu menyimpan education, experience, project,
            certification, dan skill awal ke database.
          </p>
        </section>

        <form
          onSubmit={submitCv}
          className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="File name">
              <Input
                value={cvForm.fileName}
                onChange={(event) =>
                  setCvForm((prev) => ({ ...prev, fileName: event.target.value }))
                }
              />
            </Field>
            <Field label="File type">
              <Input
                value={cvForm.fileType}
                onChange={(event) =>
                  setCvForm((prev) => ({ ...prev, fileType: event.target.value }))
                }
              />
            </Field>
            <Field label="File URL">
              <Input
                value={cvForm.fileUrl}
                onChange={(event) =>
                  setCvForm((prev) => ({ ...prev, fileUrl: event.target.value }))
                }
              />
            </Field>
          </div>

          <Field label="Raw CV text">
            <textarea
              value={cvForm.rawText}
              onChange={(event) =>
                setCvForm((prev) => ({ ...prev, rawText: event.target.value }))
              }
              rows={12}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="Paste isi CV di sini..."
            />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Endpoint: POST /job-seeker/onboarding/cv/parse
            </p>
            <Button type="submit" disabled={parsing} className="rounded-full px-6">
              {parsing ? 'Memproses…' : 'Parse dan Simpan CV'}
            </Button>
          </div>
        </form>

        {parseResult && (
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-800">
              CV berhasil diparsing
            </p>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-5">
              <Count label="Education" value={parseResult.inserted.educations} />
              <Count label="Experience" value={parseResult.inserted.experiences} />
              <Count label="Project" value={parseResult.inserted.projects} />
              <Count
                label="Certification"
                value={parseResult.inserted.certifications}
              />
              <Count label="Skill" value={parseResult.inserted.skills} />
            </div>
            <p className="mt-3 text-xs text-emerald-700">
              Confidence AI: {Math.round(parseResult.confidenceScore * 100)}%
            </p>
          </section>
        )}

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Input manual tambahan
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Pakai ini untuk melengkapi atau mengoreksi hasil parsing CV.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/job-seeker')}
            >
              Ke Dashboard
            </Button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ManualCard
              title="Education"
              endpoint="/job-seeker/onboarding/educations"
              saving={saving === 'education'}
              onSubmit={() =>
                submitManual(
                  'education',
                  () =>
                    seekerApi.createEducation({
                      ...education,
                      startYear: toNumberOrUndefined(education.startYear),
                      endYear: toNumberOrUndefined(education.endYear),
                      gpa: toNumberOrUndefined(education.gpa),
                    }),
                  () => setEducation(emptyEducation),
                )
              }
            >
              <select
                value={education.educationLevel ?? ''}
                onChange={(event) =>
                  setEducation((prev) => ({
                    ...prev,
                    educationLevel: event.target.value
                      ? (event.target.value as EducationLevel)
                      : undefined,
                  }))
                }
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="">Education level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Institution"
                value={education.institution ?? ''}
                onChange={(event) =>
                  setEducation((prev) => ({
                    ...prev,
                    institution: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Major"
                value={education.major ?? ''}
                onChange={(event) =>
                  setEducation((prev) => ({ ...prev, major: event.target.value }))
                }
              />
              <Input
                placeholder="Degree"
                value={education.degree}
                required
                onChange={(event) =>
                  setEducation((prev) => ({ ...prev, degree: event.target.value }))
                }
              />
            </ManualCard>

            <ManualCard
              title="Experience"
              endpoint="/job-seeker/onboarding/experiences"
              saving={saving === 'experience'}
              onSubmit={() =>
                submitManual(
                  'experience',
                  () => seekerApi.createExperience(experience),
                  () => setExperience(emptyExperience),
                )
              }
            >
              <Input
                placeholder="Title"
                value={experience.title}
                required
                onChange={(event) =>
                  setExperience((prev) => ({ ...prev, title: event.target.value }))
                }
              />
              <Input
                placeholder="Organization"
                value={experience.organization}
                required
                onChange={(event) =>
                  setExperience((prev) => ({
                    ...prev,
                    organization: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Experience type"
                value={experience.experienceType}
                required
                onChange={(event) =>
                  setExperience((prev) => ({
                    ...prev,
                    experienceType: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Description"
                value={experience.description ?? ''}
                onChange={(event) =>
                  setExperience((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </ManualCard>

            <ManualCard
              title="Project"
              endpoint="/job-seeker/onboarding/projects"
              saving={saving === 'project'}
              onSubmit={() =>
                submitManual(
                  'project',
                  () => seekerApi.createProject(project),
                  () => setProject(emptyProject),
                )
              }
            >
              <Input
                placeholder="Project name"
                value={project.projectName}
                required
                onChange={(event) =>
                  setProject((prev) => ({
                    ...prev,
                    projectName: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Tools used"
                value={project.toolsUsed ?? ''}
                onChange={(event) =>
                  setProject((prev) => ({
                    ...prev,
                    toolsUsed: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Description"
                value={project.description ?? ''}
                onChange={(event) =>
                  setProject((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
            </ManualCard>

            <ManualCard
              title="Certification"
              endpoint="/job-seeker/onboarding/certifications"
              saving={saving === 'certification'}
              onSubmit={() =>
                submitManual(
                  'certification',
                  () =>
                    seekerApi.createCertification({
                      ...certification,
                      issuedYear: toNumberOrUndefined(certification.issuedYear),
                    }),
                  () => setCertification(emptyCertification),
                )
              }
            >
              <Input
                placeholder="Certification name"
                value={certification.certificationName}
                required
                onChange={(event) =>
                  setCertification((prev) => ({
                    ...prev,
                    certificationName: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Issuer"
                value={certification.issuer}
                required
                onChange={(event) =>
                  setCertification((prev) => ({
                    ...prev,
                    issuer: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Issued year"
                type="number"
                value={certification.issuedYear ?? ''}
                onChange={(event) =>
                  setCertification((prev) => ({
                    ...prev,
                    issuedYear: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  }))
                }
              />
            </ManualCard>

            <ManualCard
              title="Skill"
              endpoint="/job-seeker/onboarding/skills"
              saving={saving === 'skill'}
              onSubmit={() =>
                submitManual(
                  'skill',
                  () => seekerApi.createSkill(skill),
                  () => setSkill(emptySkill),
                )
              }
            >
              <Input
                placeholder="Detected text"
                value={skill.detectedText}
                required
                onChange={(event) =>
                  setSkill((prev) => ({
                    ...prev,
                    detectedText: event.target.value,
                  }))
                }
              />
              <Input
                placeholder="Inferred level"
                value={skill.inferredLevel ?? ''}
                onChange={(event) =>
                  setSkill((prev) => ({
                    ...prev,
                    inferredLevel: event.target.value,
                  }))
                }
              />
            </ManualCard>
          </div>
        </section>
      </main>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  )
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function ManualCard({
  title,
  endpoint,
  saving,
  children,
  onSubmit,
}: {
  title: string
  endpoint: string
  saving: boolean
  children: React.ReactNode
  onSubmit: () => void
}) {
  return (
    <form
      className="grid gap-3 rounded-xl border border-gray-100 p-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{endpoint}</p>
      </div>
      {children}
      <Button type="submit" disabled={saving} className="justify-self-start">
        {saving ? 'Menyimpan…' : `Simpan ${title}`}
      </Button>
    </form>
  )
}

function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}
