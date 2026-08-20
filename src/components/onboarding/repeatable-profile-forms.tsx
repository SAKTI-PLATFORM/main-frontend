'use client'

import { seekerApi } from '@/api/seeker.api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { UserProfile } from '@/types/auth.types'
import type {
  CreateCertificationPayload,
  CreateEducationPayload,
  CreateExperiencePayload,
  CreateProjectPayload,
  CreateSkillPayload,
  EducationLevel,
  ParseCvResponse,
  ParsedPersonalInfo,
  UpdateIdentityPayload,
} from '@/types/seeker.types'
import { handleApiError } from '@/utils/api-error'
import { Toast } from '@/utils/toast'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lightbulb,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

const educationLevels: EducationLevel[] = ['SMA', 'D3', 'S1', 'S2', 'S3']

const newEducation = (): CreateEducationPayload => ({ degree: '', institution: '', major: '' })
const newExperience = (): CreateExperiencePayload => ({ title: '', organization: '', experienceType: 'WORK' })
const newProject = (): CreateProjectPayload => ({ projectName: '', description: '', toolsUsed: '' })
const newCertification = (): CreateCertificationPayload => ({ certificationName: '', issuer: '' })
const newSkill = (): CreateSkillPayload => ({ detectedText: '', evidenceSource: 'manual' })

export function RepeatableProfileForms({
  activeStep,
  parseResult,
  accountProfile,
  onBack,
  onNext,
  onSaved,
}: {
  activeStep: number
  parseResult: ParseCvResponse
  accountProfile: UserProfile | null
  onBack: () => void
  onNext: () => void
  onSaved?: () => Promise<void>
}) {
  const [saving, setSaving] = useState(false)
  const [identity, setIdentity] = useState<UpdateIdentityPayload>(() =>
    toIdentityPayload(parseResult, accountProfile),
  )
  const [educations, setEducations] = useState<CreateEducationPayload[]>(() =>
    parseResult.parsedResult.educations.map(toEducationPayload),
  )
  const [experiences, setExperiences] = useState<CreateExperiencePayload[]>(() =>
    parseResult.parsedResult.experiences.map(toExperiencePayload),
  )
  const [projects, setProjects] = useState<CreateProjectPayload[]>(() =>
    parseResult.parsedResult.projects.map(toProjectPayload),
  )
  const [certifications, setCertifications] = useState<CreateCertificationPayload[]>(() =>
    parseResult.parsedResult.certifications.map(toCertificationPayload),
  )
  const [skills, setSkills] = useState<CreateSkillPayload[]>(() =>
    parseResult.parsedResult.skills.map(toSkillPayload),
  )

  const completeEducations = educations.filter(isEducationComplete)
  const completeExperiences = experiences.filter(isExperienceComplete)
  const completeProjects = projects.filter(isProjectComplete)
  const completeCertifications = certifications.filter(isCertificationComplete)
  const completeSkills = skills.filter(isSkillComplete)
  const totalCount =
    completeEducations.length +
    completeExperiences.length +
    completeProjects.length +
    completeCertifications.length +
    completeSkills.length

  useEffect(() => {
    if (!accountProfile) return
    setIdentity((current) => ({
      ...current,
      fullName: current.fullName || accountProfile.fullName,
      email: current.email || accountProfile.email,
      phoneNumber: current.phoneNumber || accountProfile.phoneNumber || '',
      domicile: current.domicile || accountProfile.domicile || '',
      professionalHeadline:
        current.professionalHeadline || accountProfile.professionalHeadline || '',
      linkedinUrl: current.linkedinUrl || accountProfile.linkedinUrl || '',
      profileSummary: current.profileSummary || accountProfile.profileSummary || '',
    }))
  }, [accountProfile])

  async function saveProfile() {
    if (!isIdentityComplete(identity)) {
      Toast.error('Nama lengkap dan email yang valid wajib diisi.')
      return
    }
    if (hasIncompleteEntries()) {
      Toast.error('Lengkapi atau hapus entri yang masih belum lengkap.')
      return
    }

    setSaving(true)
    try {
      await seekerApi.bulkUpsertProfile({
        identity,
        educations: completeEducations,
        experiences: completeExperiences,
        projects: completeProjects,
        certifications: completeCertifications,
        skills: completeSkills,
      })
      window.localStorage.setItem('sakti:onboarding:cvParsed', 'true')
      Toast.success(totalCount ? `${totalCount} data profil berhasil disimpan.` : 'Profil CV sudah siap digunakan.')
      if (onSaved) await onSaved()
    } catch (error) {
      handleApiError(error)
    } finally {
      setSaving(false)
    }
  }

  function continueToNext() {
    if (activeStep === 1 && !isIdentityComplete(identity)) {
      Toast.error('Nama lengkap dan email yang valid wajib diisi.')
      return
    }
    onNext()
  }

  function hasIncompleteEntries(): boolean {
    return (
      experiences.some((entry) => !isExperienceComplete(entry)) ||
      educations.some((entry) => !isEducationComplete(entry)) ||
      projects.some((entry) => !isProjectComplete(entry)) ||
      certifications.some((entry) => !isCertificationComplete(entry)) ||
      skills.some((entry) => !isSkillComplete(entry))
    )
  }

  return (
    <>
      {activeStep === 1 && (
        <StepPanel
          title="Informasi pribadi"
          description="Periksa kembali data yang dibaca dari bagian header dan profil CV."
          headerAccessory={(
            <span className="flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900">
              <Lightbulb className="size-4 text-amber-600" />
              Tips
            </span>
          )}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama lengkap">
              <Input value={identity.fullName} required onChange={(event) => setIdentity((current) => ({ ...current, fullName: event.target.value }))} placeholder="Nama lengkap" />
            </Field>
            <Field label="Professional headline">
              <Input value={identity.professionalHeadline ?? ''} onChange={(event) => setIdentity((current) => ({ ...current, professionalHeadline: event.target.value }))} placeholder="Contoh: Software Engineer & AI Enthusiast" />
            </Field>
            <Field label="Email">
              <Input type="email" value={identity.email} required onChange={(event) => setIdentity((current) => ({ ...current, email: event.target.value }))} placeholder="nama@email.com" />
            </Field>
            <Field label="Nomor telepon">
              <Input type="tel" value={identity.phoneNumber ?? ''} onChange={(event) => setIdentity((current) => ({ ...current, phoneNumber: event.target.value }))} placeholder="+62 812-3456-7890" />
            </Field>
            <Field label="Kota domisili">
              <Input value={identity.domicile ?? ''} onChange={(event) => setIdentity((current) => ({ ...current, domicile: event.target.value }))} placeholder="Bogor, Indonesia" />
            </Field>
            <Field label="LinkedIn">
              <Input value={identity.linkedinUrl ?? ''} onChange={(event) => setIdentity((current) => ({ ...current, linkedinUrl: event.target.value }))} placeholder="linkedin.com/in/username" />
            </Field>
            <Field label="Ringkasan profil" wide>
              <TextArea value={identity.profileSummary ?? ''} onChange={(value) => setIdentity((current) => ({ ...current, profileSummary: value }))} placeholder="Ringkasan pengalaman, kekuatan utama, dan target karier" />
            </Field>
          </div>
        </StepPanel>
      )}

      {activeStep === 2 && (
        <StepPanel
          title="Pengalaman kerja"
          description="Periksa dan koreksi pengalaman yang dibaca dari CV sebelum menyimpan profil."
          detectedCount={parseResult.detected.experiences}
        >
          <RecordSection title="Pengalaman" count={experiences.length} onAdd={() => setExperiences((items) => [...items, newExperience()])}>
            {experiences.map((entry, index) => (
              <RecordEntry key={index} label={entry.title || `Pengalaman ${index + 1}`} onRemove={() => setExperiences((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                <Field label="Posisi"><Input className="h-10" value={entry.title} required onChange={(event) => setExperiences((items) => updateAt(items, index, { title: event.target.value }))} placeholder="Contoh: Data Analyst" /></Field>
                <Field label="Organisasi"><Input className="h-10" value={entry.organization} required onChange={(event) => setExperiences((items) => updateAt(items, index, { organization: event.target.value }))} placeholder="Nama perusahaan atau organisasi" /></Field>
                <Field label="Jenis pengalaman">
                  <Select value={entry.experienceType} onChange={(value) => setExperiences((items) => updateAt(items, index, { experienceType: value }))}>
                    <option value="WORK">Pekerjaan</option><option value="INTERNSHIP">Magang</option><option value="ORGANIZATION">Organisasi</option><option value="VOLUNTEER">Volunteer</option><option value="FREELANCE">Freelance</option><option value="OTHER">Lainnya</option>
                  </Select>
                </Field>
                <Field label="Mulai"><Input className="h-10" type="date" value={entry.startDate ?? ''} onChange={(event) => setExperiences((items) => updateAt(items, index, { startDate: event.target.value }))} /></Field>
                <Field label="Selesai"><Input className="h-10" type="date" value={entry.endDate ?? ''} disabled={entry.isCurrent} onChange={(event) => setExperiences((items) => updateAt(items, index, { endDate: event.target.value }))} /></Field>
                <Field label="Status">
                  <label className="flex h-10 items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={entry.isCurrent ?? false} onChange={(event) => setExperiences((items) => updateAt(items, index, { isCurrent: event.target.checked, endDate: event.target.checked ? undefined : entry.endDate }))} />Masih berlangsung</label>
                </Field>
                <Field label="Durasi (bulan)"><Input className="h-10" type="number" min="0" value={entry.durationMonths ?? ''} onChange={(event) => setExperiences((items) => updateAt(items, index, { durationMonths: optionalNumber(event.target.value) }))} /></Field>
                <Field label="Deskripsi dan pencapaian" wide><TextArea value={entry.description ?? ''} onChange={(value) => setExperiences((items) => updateAt(items, index, { description: value }))} placeholder="Jelaskan tanggung jawab dan dampak kerja" /></Field>
              </RecordEntry>
            ))}
          </RecordSection>
        </StepPanel>
      )}

      {activeStep === 3 && (
        <StepPanel title="Riwayat pendidikan" description="Periksa dan koreksi pendidikan yang dibaca dari CV sebelum menyimpan profil." detectedCount={parseResult.detected.educations}>
          <RecordSection title="Pendidikan" count={educations.length} onAdd={() => setEducations((items) => [...items, newEducation()])}>
            {educations.map((entry, index) => (
              <RecordEntry key={index} label={entry.institution || `Pendidikan ${index + 1}`} onRemove={() => setEducations((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                <Field label="Institusi"><Input className="h-10" value={entry.institution ?? ''} onChange={(event) => setEducations((items) => updateAt(items, index, { institution: event.target.value }))} placeholder="Nama sekolah atau universitas" /></Field>
                <Field label="Jenjang"><Select value={entry.educationLevel ?? ''} onChange={(value) => setEducations((items) => updateAt(items, index, { educationLevel: value ? (value as EducationLevel) : undefined }))}><option value="">Pilih jenjang</option>{educationLevels.map((level) => <option key={level} value={level}>{level}</option>)}</Select></Field>
                <Field label="Program studi"><Input className="h-10" value={entry.major ?? ''} onChange={(event) => setEducations((items) => updateAt(items, index, { major: event.target.value }))} /></Field>
                <Field label="Gelar"><Input className="h-10" value={entry.degree} required onChange={(event) => setEducations((items) => updateAt(items, index, { degree: event.target.value }))} placeholder="Contoh: Sarjana Komputer" /></Field>
                <Field label="Tahun mulai"><Input className="h-10" type="number" min="1900" max="2100" value={entry.startYear ?? ''} onChange={(event) => setEducations((items) => updateAt(items, index, { startYear: optionalNumber(event.target.value) }))} /></Field>
                <Field label="Tahun selesai"><Input className="h-10" type="number" min="1900" max="2100" value={entry.endYear ?? ''} disabled={entry.isCurrent} onChange={(event) => setEducations((items) => updateAt(items, index, { endYear: optionalNumber(event.target.value) }))} /></Field>
                <Field label="IPK"><Input className="h-10" type="number" min="0" max="4" step="0.01" value={entry.gpa ?? ''} onChange={(event) => setEducations((items) => updateAt(items, index, { gpa: optionalNumber(event.target.value) }))} /></Field>
                <Field label="Status"><label className="flex h-10 items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={entry.isCurrent ?? false} onChange={(event) => setEducations((items) => updateAt(items, index, { isCurrent: event.target.checked, endYear: event.target.checked ? undefined : entry.endYear }))} />Masih menempuh pendidikan</label></Field>
              </RecordEntry>
            ))}
          </RecordSection>
        </StepPanel>
      )}

      {activeStep === 4 && (
        <StepPanel title="Sertifikasi" description="Periksa kredensial yang dibaca dari CV atau tambahkan sertifikasi lain." detectedCount={parseResult.detected.certifications}>
          <RecordSection title="Sertifikasi" count={certifications.length} onAdd={() => setCertifications((items) => [...items, newCertification()])}>
            {certifications.map((entry, index) => (
              <RecordEntry key={index} label={entry.certificationName || `Sertifikasi ${index + 1}`} onRemove={() => setCertifications((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                <Field label="Nama sertifikasi"><Input className="h-10" value={entry.certificationName} required onChange={(event) => setCertifications((items) => updateAt(items, index, { certificationName: event.target.value }))} /></Field>
                <Field label="Penerbit"><Input className="h-10" value={entry.issuer} required onChange={(event) => setCertifications((items) => updateAt(items, index, { issuer: event.target.value }))} /></Field>
                <Field label="Tahun terbit"><Input className="h-10" type="number" min="1900" max="2100" value={entry.issuedYear ?? ''} onChange={(event) => setCertifications((items) => updateAt(items, index, { issuedYear: optionalNumber(event.target.value) }))} /></Field>
                <Field label="Tautan sertifikat"><Input className="h-10" type="url" value={entry.certificateUrl ?? ''} onChange={(event) => setCertifications((items) => updateAt(items, index, { certificateUrl: event.target.value }))} placeholder="https://" /></Field>
              </RecordEntry>
            ))}
          </RecordSection>
        </StepPanel>
      )}

      {activeStep === 5 && (
        <StepPanel title="Skill" description="Periksa skill serta estimasi jam belajar dan jam praktik kerja yang dibaca dari CV." detectedCount={parseResult.detected.skills}>
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Skill</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{skills.length}</span>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setSkills((items) => [...items, newSkill()])}>
                <Plus className="size-4" />Tambah skill
              </Button>
            </div>

            <div className="space-y-2">
              {skills.map((entry, index) => (
                <article key={index} className="relative grid grid-cols-2 gap-2 rounded-lg border border-border bg-card p-3 pr-12 sm:grid-cols-[minmax(180px,2fr)_minmax(120px,1fr)_minmax(120px,1fr)_36px] sm:items-end sm:gap-3 sm:pr-3">
                  <label className="col-span-2 grid min-w-0 gap-1 sm:col-span-1">
                    <span className="text-[11px] font-semibold text-foreground/70">Nama skill</span>
                    <Input className="h-9" value={entry.detectedText} required onChange={(event) => setSkills((items) => updateAt(items, index, { detectedText: event.target.value }))} placeholder="Contoh: SQL" />
                  </label>
                  <label className="grid min-w-0 gap-1">
                    <span className="text-[11px] font-semibold text-foreground/70">Learning hours</span>
                    <Input className="h-9" type="number" min="0" step="0.5" value={entry.learningHours ?? ''} onChange={(event) => setSkills((items) => updateAt(items, index, { learningHours: optionalNumber(event.target.value) }))} placeholder="120 jam" />
                  </label>
                  <label className="grid min-w-0 gap-1">
                    <span className="text-[11px] font-semibold text-foreground/70">Working hours</span>
                    <Input className="h-9" type="number" min="0" step="0.5" value={entry.workingHours ?? ''} onChange={(event) => setSkills((items) => updateAt(items, index, { workingHours: optionalNumber(event.target.value) }))} placeholder="960 jam" />
                  </label>
                  <Button type="button" variant="ghost" size="icon-sm" className="absolute right-2 top-2 text-red-600 hover:text-red-700 sm:static" onClick={() => setSkills((items) => items.filter((_, itemIndex) => itemIndex !== index))} title={`Hapus ${entry.detectedText || `skill ${index + 1}`}`}>
                    <Trash2 className="size-4" />
                    <span className="sr-only">Hapus {entry.detectedText || `skill ${index + 1}`}</span>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </StepPanel>
      )}

      {activeStep === 6 && (
        <StepPanel title="Proyek" description="Periksa nama, teknologi, periode, dan deskripsi proyek yang dibaca dari CV." detectedCount={parseResult.detected.projects}>
          <RecordSection title="Proyek" count={projects.length} onAdd={() => setProjects((items) => [...items, newProject()])}>
            {projects.map((entry, index) => (
              <RecordEntry key={index} label={entry.projectName || `Proyek ${index + 1}`} onRemove={() => setProjects((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                <Field label="Nama proyek"><Input className="h-10" value={entry.projectName} required onChange={(event) => setProjects((items) => updateAt(items, index, { projectName: event.target.value }))} /></Field>
                <Field label="Teknologi"><Input className="h-10" value={entry.toolsUsed ?? ''} onChange={(event) => setProjects((items) => updateAt(items, index, { toolsUsed: event.target.value }))} placeholder="Contoh: Python, Power BI" /></Field>
                <Field label="Mulai"><Input className="h-10" type="date" value={entry.startDate ?? ''} onChange={(event) => setProjects((items) => updateAt(items, index, { startDate: event.target.value }))} /></Field>
                <Field label="Selesai"><Input className="h-10" type="date" value={entry.endDate ?? ''} onChange={(event) => setProjects((items) => updateAt(items, index, { endDate: event.target.value }))} /></Field>
                <Field label="Deskripsi" wide><TextArea value={entry.description ?? ''} onChange={(value) => setProjects((items) => updateAt(items, index, { description: value }))} placeholder="Masalah, solusi, kontribusi, dan hasil proyek" /></Field>
              </RecordEntry>
            ))}
          </RecordSection>
        </StepPanel>
      )}

      {activeStep === 7 && (
        <StepPanel title="Ringkasan profil CV" description="Tinjau jumlah dan data utama yang akan disimpan ke profilmu.">
          <div className="grid gap-4 sm:grid-cols-2">
            <ReviewSection title="Identitas">
              <ReviewRow label="Nama" value={identity.fullName || '-'} />
              <ReviewRow label="Email" value={identity.email || '-'} />
              <ReviewRow label="Headline" value={identity.professionalHeadline || '-'} />
              <ReviewRow label="Domisili" value={identity.domicile || '-'} />
            </ReviewSection>
            <ReviewSection title="Data yang akan disimpan">
              <ReviewRow label="Pengalaman" value={`${completeExperiences.length} entri`} />
              <ReviewRow label="Pendidikan" value={`${completeEducations.length} entri`} />
              <ReviewRow label="Sertifikasi" value={`${completeCertifications.length} entri`} />
              <ReviewRow label="Skill" value={`${completeSkills.length} entri`} />
              <ReviewRow label="Proyek" value={`${completeProjects.length} entri`} />
            </ReviewSection>
            <ReviewSection title="Hasil awal dari CV">
              <ReviewRow label="Pengalaman" value={`${parseResult.detected.experiences} terdeteksi`} />
              <ReviewRow label="Pendidikan" value={`${parseResult.detected.educations} terdeteksi`} />
              <ReviewRow label="Sertifikasi" value={`${parseResult.detected.certifications} terdeteksi`} />
              <ReviewRow label="Skill" value={`${parseResult.detected.skills} terdeteksi`} />
              <ReviewRow label="Proyek" value={`${parseResult.detected.projects} terdeteksi`} />
            </ReviewSection>
            <ReviewSection title="Pengalaman utama">
              <ReviewRow label="Posisi" value={completeExperiences[0]?.title || '-'} />
              <ReviewRow label="Organisasi" value={completeExperiences[0]?.organization || '-'} />
            </ReviewSection>
            <ReviewSection title="Pendidikan utama">
              <ReviewRow label="Institusi" value={completeEducations[0]?.institution || '-'} />
              <ReviewRow label="Program" value={completeEducations[0]?.major || completeEducations[0]?.degree || '-'} />
            </ReviewSection>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><CheckCircle2 className="mt-0.5 size-5 shrink-0" /><span>Perubahanmu baru disimpan ke profil setelah tombol Simpan profil dipilih.</span></div>
        </StepPanel>
      )}

      <footer className="sticky bottom-4 z-20 mt-5 flex items-center justify-between gap-3 rounded-xl bg-card/95 p-3 shadow-sm ring-1 ring-foreground/10 backdrop-blur">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={saving}><ArrowLeft />Kembali</Button>
        {activeStep < 7 ? (
          <Button type="button" size="lg" onClick={continueToNext}>Lanjutkan<ArrowRight /></Button>
        ) : (
          <Button type="button" size="lg" onClick={() => void saveProfile()} disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : <Save />}{saving ? 'Menyimpan...' : 'Simpan profil'}</Button>
        )}
      </footer>
    </>
  )
}

function StepPanel({ title, description, detectedCount, headerAccessory, children }: { title: string; description: string; detectedCount?: number; headerAccessory?: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3 sm:flex-row">
        <div><CardTitle>{title}</CardTitle><CardDescription className="mt-1 max-w-3xl leading-6">{description}</CardDescription></div>
        {headerAccessory ?? (detectedCount !== undefined && <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">{detectedCount} terdeteksi dari CV</span>)}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function RecordSection({ title, count, onAdd, children }: { title: string; count: number; onAdd: () => void; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><h3 className="font-semibold text-foreground">{title}</h3><span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{count}</span></div></div>
      <div className="space-y-3">{children}</div>
      <button type="button" onClick={onAdd} className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5"><Plus className="size-4" />Tambah {title.toLowerCase()}</button>
    </div>
  )
}

function RecordEntry({ label, onRemove, children }: { label: string; onRemove: () => void; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-3"><p className="min-w-0 truncate text-sm font-semibold text-foreground">{label}</p><div className="flex items-center gap-1"><Button type="button" variant="ghost" size="icon" onClick={onRemove} title={`Hapus ${label}`}><Trash2 className="text-red-600" /><span className="sr-only">Hapus {label}</span></Button><Button type="button" variant="ghost" size="icon" onClick={() => setCollapsed((value) => !value)} title={collapsed ? 'Buka entri' : 'Tutup entri'}>{collapsed ? <ChevronDown /> : <ChevronUp />}<span className="sr-only">{collapsed ? 'Buka entri' : 'Tutup entri'}</span></Button></div></header>
      {!collapsed && <div className="grid gap-4 p-4 sm:grid-cols-2">{children}</div>}
    </article>
  )
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return <label className={`grid min-w-0 gap-1.5 ${wide ? 'sm:col-span-2' : ''}`}><span className="text-xs font-semibold text-foreground/80">{label}</span>{children}</label>
}

function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">{children}</select>
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <Textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} placeholder={placeholder} />
}

function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-lg border border-border p-4"><h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>{children}</section>
}

function ReviewRow({ label, value }: { label: string; value: ReactNode }) {
  return <div className="grid grid-cols-[112px_1fr] gap-3 border-t border-border py-2 text-sm first:border-t-0"><span className="text-muted-foreground">{label}</span><strong className="min-w-0 break-words font-semibold text-foreground">{value}</strong></div>
}

function updateAt<T>(items: T[], index: number, values: Partial<T>): T[] {
  return items.map((item, itemIndex) => itemIndex === index ? { ...item, ...values } : item)
}

function optionalNumber(value: string): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function readString(item: Record<string, unknown>, key: string): string {
  const value = item[key]
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(item: Record<string, unknown>, key: string): number | undefined {
  const value = item[key]
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) return optionalNumber(value)
  return undefined
}

function readBoolean(item: Record<string, unknown>, key: string): boolean {
  return item[key] === true
}

function readDate(item: Record<string, unknown>, key: string): string | undefined {
  const value = readString(item, key)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  if (/^\d{4}$/.test(value)) return `${value}-01-01`
  return undefined
}

function readEducationLevel(item: Record<string, unknown>): EducationLevel | undefined {
  const value = readString(item, 'education_level')
  return educationLevels.includes(value as EducationLevel) ? value as EducationLevel : undefined
}

function toExperiencePayload(item: Record<string, unknown>): CreateExperiencePayload {
  return {
    source: 'HYBRID',
    title: readString(item, 'title'),
    organization: readString(item, 'organization'),
    experienceType: readString(item, 'experience_type') || 'WORK',
    startDate: readDate(item, 'start_date'),
    endDate: readDate(item, 'end_date'),
    isCurrent: readBoolean(item, 'is_current'),
    durationMonths: readNumber(item, 'duration_months'),
    description: readString(item, 'description') || undefined,
  }
}

function toEducationPayload(item: Record<string, unknown>): CreateEducationPayload {
  return {
    source: 'HYBRID',
    educationLevel: readEducationLevel(item),
    institution: readString(item, 'institution') || undefined,
    major: readString(item, 'major') || undefined,
    degree: readString(item, 'degree') || readString(item, 'education_level'),
    startYear: readNumber(item, 'start_year'),
    endYear: readNumber(item, 'end_year'),
    gpa: readNumber(item, 'gpa'),
    isCurrent: readBoolean(item, 'is_current'),
  }
}

function toProjectPayload(item: Record<string, unknown>): CreateProjectPayload {
  return {
    source: 'HYBRID',
    projectName: readString(item, 'project_name'),
    description: readString(item, 'description') || undefined,
    toolsUsed: readString(item, 'tools_used') || undefined,
    startDate: readDate(item, 'start_date'),
    endDate: readDate(item, 'end_date'),
  }
}

function toCertificationPayload(item: Record<string, unknown>): CreateCertificationPayload {
  return {
    source: 'HYBRID',
    certificationName: readString(item, 'certification_name'),
    issuer: readString(item, 'issuer'),
    issuedYear: readNumber(item, 'issued_year'),
    certificateUrl: readString(item, 'certificate_url') || undefined,
  }
}

function toSkillPayload(item: Record<string, unknown>): CreateSkillPayload {
  return {
    detectedText: readString(item, 'detected_text'),
    confidenceScore: readNumber(item, 'confidence_score'),
    learningHours: readNumber(item, 'learning_hours'),
    workingHours: readNumber(item, 'working_hours'),
    evidenceSource: readString(item, 'evidence_source') || 'cv_text',
    evidenceStrength: readString(item, 'evidence_strength') || undefined,
  }
}

function toIdentityPayload(
  parseResult: ParseCvResponse,
  accountProfile: UserProfile | null,
): UpdateIdentityPayload {
  type LegacyPersonalInfo = Partial<Record<
    | 'full_name'
    | 'professional_headline'
    | 'email'
    | 'phone_number'
    | 'domicile'
    | 'linkedin_url'
    | 'profile_summary',
    string | null
  >>
  const parsed = (parseResult.parsedResult.personalInfo ?? {}) as Partial<ParsedPersonalInfo>
  const legacy = (parseResult.parsedResult as typeof parseResult.parsedResult & {
    personal_info?: LegacyPersonalInfo
  }).personal_info ?? {}
  const value = (
    camelKey: keyof ParsedPersonalInfo,
    snakeKey: keyof LegacyPersonalInfo,
  ): string => parsed[camelKey] || legacy[snakeKey] || ''

  return {
    fullName: value('fullName', 'full_name') || accountProfile?.fullName || '',
    email: value('email', 'email') || accountProfile?.email || '',
    professionalHeadline:
      value('professionalHeadline', 'professional_headline') ||
      accountProfile?.professionalHeadline ||
      '',
    phoneNumber:
      value('phoneNumber', 'phone_number') || accountProfile?.phoneNumber || '',
    domicile: value('domicile', 'domicile') || accountProfile?.domicile || '',
    linkedinUrl:
      value('linkedinUrl', 'linkedin_url') || accountProfile?.linkedinUrl || '',
    profileSummary:
      value('profileSummary', 'profile_summary') ||
      accountProfile?.profileSummary ||
      '',
  }
}

function isIdentityComplete(identity: UpdateIdentityPayload): boolean {
  return Boolean(
    identity.fullName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email.trim()),
  )
}

function isExperienceComplete(entry: CreateExperiencePayload): boolean { return Boolean(entry.title.trim() && entry.organization.trim() && entry.experienceType.trim()) }
function isEducationComplete(entry: CreateEducationPayload): boolean { return Boolean(entry.degree.trim()) }
function isProjectComplete(entry: CreateProjectPayload): boolean { return Boolean(entry.projectName.trim()) }
function isCertificationComplete(entry: CreateCertificationPayload): boolean { return Boolean(entry.certificationName.trim() && entry.issuer.trim()) }
function isSkillComplete(entry: CreateSkillPayload): boolean { return Boolean(entry.detectedText.trim()) }
