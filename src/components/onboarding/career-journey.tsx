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
import { LikertScale } from '@/components/onboarding/likert-scale'
import type {
  AssessmentQuestionsResponse,
  AssessmentResultResponse,
  AssessmentType,
  DoubleDiamondAnswer,
  DoubleDiamondPhase,
  DoubleDiamondQuestion,
  DoubleDiamondQuestionsResponse,
  DoubleDiamondResultResponse,
  OnboardingCurrentStep,
  OnboardingSessionResponse,
} from '@/types/career-onboarding.types'
import { handleApiError } from '@/utils/api-error'
import { Toast } from '@/utils/toast'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

const JOURNEY = [
  { title: 'Mulai', caption: 'CV & identitas' },
  { title: 'Psikometri', caption: 'OCEAN · RIASEC' },
  { title: 'Double Diamond', caption: 'Eksplorasi terpersonalisasi' },
  { title: 'Preferensi', caption: 'Konfirmasi arah karier' },
  { title: 'Profil Lengkap', caption: 'Siap matching' },
] as const

const DD_PHASES: DoubleDiamondPhase[] = [
  'DIVERGE_1',
  'CONVERGE_1',
  'DIVERGE_2',
  'CONVERGE_2',
]

export function CareerJourney({
  initialSession,
}: {
  initialSession: OnboardingSessionResponse
}) {
  const [session, setSession] = useState(initialSession)
  const activeJourney = journeyIndex(session.current_step)

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-3 py-5 md:flex">
        <div className="flex items-center px-2 pb-6">
          <Image
            src="/logo-color.png"
            alt="SAKTI AI"
            width={120}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </div>
        <nav className="flex flex-col gap-1" aria-label="Tahapan onboarding">
          {JOURNEY.map((item, index) => {
            const active = index === activeJourney
            const complete = index < activeJourney
            return (
              <div
                key={item.title}
                className={`grid min-h-16 grid-cols-[28px_1fr] items-center gap-3 rounded-lg px-3 py-2 ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${complete ? 'bg-emerald-600 text-white' : active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  {complete ? <Check className="size-4" /> : index + 1}
                </span>
                <span>
                  <strong className="block text-sm">{item.title}</strong>
                  <span className="text-xs opacity-70">{item.caption}</span>
                </span>
              </div>
            )
          })}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-4xl">
          {(session.current_step === 'OCEAN' ||
            session.current_step === 'RIASEC') && (
            <AssessmentPanel
              session={session}
              type={session.current_step}
              onAdvance={(step) =>
                setSession((current) => ({ ...current, current_step: step }))
              }
            />
          )}
          {DD_PHASES.includes(session.current_step as DoubleDiamondPhase) && (
            <DoubleDiamondPanel
              key={session.current_step}
              session={session}
              phase={session.current_step as DoubleDiamondPhase}
              onAdvance={(step) =>
                setSession((current) => ({ ...current, current_step: step }))
              }
            />
          )}
          {(session.current_step === 'PREFERENCE' ||
            session.current_step === 'COMPLETE') && (
            <ResultPanel session={session} onSession={setSession} />
          )}
        </div>
      </main>
    </div>
  )
}

function AssessmentPanel({
  session,
  type,
  onAdvance,
}: {
  session: OnboardingSessionResponse
  type: AssessmentType
  onAdvance: (step: OnboardingCurrentStep) => void
}) {
  const [data, setData] = useState<AssessmentQuestionsResponse | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')
  const dirty = useRef(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await seekerApi.getAssessmentQuestions(
        session.onboarding_session_id,
        type,
      )
      setData(response.data.data)
      setAnswers(response.data.data.existing_responses)
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }, [session.onboarding_session_id, type])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!dirty.current || !Object.keys(answers).length) return
    const timeout = window.setTimeout(() => {
      setSaveStatus('saving')
      void saveAssessment(session.onboarding_session_id, type, answers)
        .then(() => {
          dirty.current = false
          setSaveStatus('saved')
        })
        .catch((error) => {
          setSaveStatus('error')
          handleApiError(error)
        })
    }, 700)
    return () => window.clearTimeout(timeout)
  }, [answers, session.onboarding_session_id, type])

  if (loading) return <LoadingCard label={`Memuat pertanyaan ${type}...`} />
  if (!data) return <RetryCard onRetry={() => void load()} />

  const complete = data.questions.every(
    (question) => answers[question.question_id] !== undefined,
  )
  const progress = Math.round(
    (Object.keys(answers).length / data.questions.length) * 100,
  )

  const submit = async () => {
    if (!complete) return
    setSubmitting(true)
    try {
      await saveAssessment(session.onboarding_session_id, type, answers)
      const response = await seekerApi.submitAssessment(
        session.onboarding_session_id,
        type,
      )
      dirty.current = false
      Toast.success(
        type === 'OCEAN'
          ? 'OCEAN selesai. Lanjut ke RIASEC.'
          : 'Assessment selesai. Lanjut ke eksplorasi karier.',
      )
      onAdvance(response.data.data.current_step as OnboardingCurrentStep)
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <JourneyHeader
        eyebrow="Asesmen eksplorasi karier"
        title={
          type === 'OCEAN'
            ? 'Profil kecenderungan OCEAN'
            : 'Minat karier RIASEC'
        }
        description="Jawab sesuai kecenderunganmu saat ini. Tidak ada jawaban benar atau salah, dan hasil ini bukan diagnosis psikologis."
        progress={progress}
        status={<SaveIndicator status={saveStatus} />}
      />
      {data.questions.map((question) => (
        <Card key={question.question_id} size="sm">
          <CardHeader>
            <CardTitle className="text-lg leading-7">
              {question.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LikertScale
              value={answers[question.question_id]}
              onChange={(value) => {
                dirty.current = true
                setSaveStatus('idle')
                setAnswers((current) => ({
                  ...current,
                  [question.question_id]: value,
                }))
              }}
              minLabel={data.scale.labels['1']}
              maxLabel={data.scale.labels['5']}
              points={5}
            />
          </CardContent>
        </Card>
      ))}
      <StickyAction>
        <span className="text-sm text-muted-foreground">
          {complete
            ? 'Semua jawaban lengkap.'
            : `${data.questions.length - Object.keys(answers).length} pertanyaan belum dijawab.`}
        </span>
        <Button
          size="lg"
          disabled={!complete || submitting}
          onClick={() => void submit()}
        >
          {submitting ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          {submitting ? 'Menghitung...' : `Selesaikan ${type}`}
        </Button>
      </StickyAction>
    </div>
  )
}

async function saveAssessment(
  sessionId: string,
  type: AssessmentType,
  answers: Record<string, number>,
) {
  return seekerApi.saveAssessmentResponses(
    sessionId,
    type,
    Object.entries(answers).map(([questionId, answerValue]) => ({
      questionId,
      answerValue,
    })),
  )
}

function DoubleDiamondPanel({
  session,
  phase,
  onAdvance,
}: {
  session: OnboardingSessionResponse
  phase: DoubleDiamondPhase
  onAdvance: (step: OnboardingCurrentStep) => void
}) {
  const [data, setData] = useState<DoubleDiamondQuestionsResponse | null>(null)
  const [answers, setAnswers] = useState<Record<string, DoubleDiamondAnswer>>(
    {},
  )
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle')
  const dirty = useRef(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await seekerApi.generateDoubleDiamondQuestions(
        session.onboarding_session_id,
        phase,
      )
      setData(response.data.data)
      setAnswers(response.data.data.existing_responses ?? {})
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }, [session.onboarding_session_id, phase])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!dirty.current || !Object.keys(answers).length) return
    const timeout = window.setTimeout(() => {
      setSaveStatus('saving')
      void saveDoubleDiamond(session.onboarding_session_id, phase, answers)
        .then(() => {
          dirty.current = false
          setSaveStatus('saved')
        })
        .catch((error) => {
          setSaveStatus('error')
          handleApiError(error)
        })
    }, 700)
    return () => window.clearTimeout(timeout)
  }, [answers, session.onboarding_session_id, phase])

  if (loading)
    return (
      <LoadingCard label="SAKTI AI sedang menyiapkan pertanyaan yang relevan..." />
    )
  if (!data) return <RetryCard onRetry={() => void load()} />

  const required = data.questions.filter((question) => question.is_required)
  const complete = required.every((question) =>
    isAnswered(answers[question.question_id]),
  )
  const progress = Math.round(
    (required.filter((question) => isAnswered(answers[question.question_id]))
      .length /
      required.length) *
      100,
  )

  const submit = async () => {
    if (!complete) return
    setSubmitting(true)
    try {
      await saveDoubleDiamond(session.onboarding_session_id, phase, answers)
      const selection =
        phase === 'CONVERGE_1' || phase === 'CONVERGE_2'
          ? deriveSelection(data.questions, answers)
          : undefined
      const response = await seekerApi.submitDoubleDiamond(
        session.onboarding_session_id,
        phase,
        selection,
      )
      dirty.current = false
      Toast.success('Fase berhasil dianalisis. Pertanyaan berikutnya siap.')
      onAdvance(response.data.data.current_step as OnboardingCurrentStep)
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <JourneyHeader
        eyebrow="Double Diamond"
        title={phaseTitle(phase)}
        description={phaseDescription(phase)}
        progress={progress}
        status={<SaveIndicator status={saveStatus} />}
      />
      {data.questions.map((question, index) => (
        <Card key={question.question_id}>
          <CardHeader>
            <CardDescription>
              {question.question_code} · Pertanyaan {index + 1}
            </CardDescription>
            <CardTitle className="text-lg leading-7">
              {question.question_text}
            </CardTitle>
            {question.helper_text && (
              <p className="text-sm text-muted-foreground">
                {question.helper_text}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <DoubleDiamondQuestionInput
              question={question}
              answer={answers[question.question_id]}
              onChange={(answer) => {
                dirty.current = true
                setSaveStatus('idle')
                setAnswers((current) => ({
                  ...current,
                  [question.question_id]: answer,
                }))
              }}
            />
          </CardContent>
        </Card>
      ))}
      <StickyAction>
        <span className="text-sm text-muted-foreground">
          {complete
            ? 'Semua jawaban wajib lengkap.'
            : 'Lengkapi pertanyaan wajib untuk melanjutkan.'}
        </span>
        <Button
          size="lg"
          disabled={!complete || submitting}
          onClick={() => void submit()}
        >
          {submitting ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {submitting ? 'Menganalisis...' : 'Analisis & lanjutkan'}
        </Button>
      </StickyAction>
    </div>
  )
}

async function saveDoubleDiamond(
  sessionId: string,
  phase: DoubleDiamondPhase,
  answers: Record<string, DoubleDiamondAnswer>,
) {
  return seekerApi.saveDoubleDiamondResponses(
    sessionId,
    phase,
    Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    })),
  )
}

function DoubleDiamondQuestionInput({
  question,
  answer,
  onChange,
}: {
  question: DoubleDiamondQuestion
  answer: DoubleDiamondAnswer | undefined
  onChange: (answer: DoubleDiamondAnswer) => void
}) {
  if (question.response_type === 'TEXT') {
    return (
      <textarea
        rows={5}
        value={typeof answer === 'string' ? answer : ''}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder="Tulis jawabanmu..."
      />
    )
  }
  if (question.response_type === 'SCALE') {
    const min = question.scale_min ?? 1
    const max = question.scale_max ?? 10
    return (
      <div className="space-y-3">
        <input
          type="range"
          min={min}
          max={max}
          step="1"
          value={typeof answer === 'number' ? answer : min}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{min}</span>
          <strong className="text-primary">
            {typeof answer === 'number' ? answer : 'Pilih nilai'}
          </strong>
          <span>{max}</span>
        </div>
      </div>
    )
  }
  if (question.response_type === 'SINGLE_CHOICE') {
    return (
      <div className="grid gap-2">
        {question.options.map((option) => (
          <button
            type="button"
            key={option.code}
            onClick={() => onChange(option.code)}
            className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${answer === option.code ? 'border-primary bg-primary/5 ring-2 ring-primary/10' : 'border-border hover:bg-muted/50'}`}
          >
            <span
              className={`size-4 rounded-full border ${answer === option.code ? 'border-[5px] border-primary' : 'border-input'}`}
            />
            {option.label}
          </button>
        ))}
      </div>
    )
  }

  const selected = Array.isArray(answer) ? answer : []
  return (
    <div className="grid gap-2">
      {question.options.map((option) => {
        const index = selected.indexOf(option.code)
        const active = index >= 0
        return (
          <button
            type="button"
            key={option.code}
            onClick={() =>
              onChange(
                active
                  ? selected.filter((code) => code !== option.code)
                  : [...selected, option.code],
              )
            }
            className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${active ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
          >
            <span
              className={`flex size-5 items-center justify-center rounded ${active ? 'bg-primary text-xs font-bold text-white' : 'border border-input'}`}
            >
              {active ? (
                question.response_type === 'RANKING' ? (
                  index + 1
                ) : (
                  <Check className="size-3" />
                )
              ) : null}
            </span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function ResultPanel({
  session,
  onSession,
}: {
  session: OnboardingSessionResponse
  onSession: (session: OnboardingSessionResponse) => void
}) {
  const router = useRouter()
  const [assessment, setAssessment] = useState<AssessmentResultResponse | null>(
    null,
  )
  const [result, setResult] = useState<DoubleDiamondResultResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    void Promise.all([
      seekerApi.getAssessmentResult(session.onboarding_session_id),
      seekerApi.getDoubleDiamondResult(session.onboarding_session_id),
    ])
      .then(([assessmentResponse, resultResponse]) => {
        setAssessment(assessmentResponse.data.data)
        setResult(resultResponse.data.data)
      })
      .catch(handleApiError)
      .finally(() => setLoading(false))
  }, [session.onboarding_session_id])

  if (loading)
    return <LoadingCard label="Menyiapkan ringkasan arah karier..." />
  if (!result || !assessment)
    return <RetryCard onRetry={() => window.location.reload()} />

  const finish = async () => {
    if (session.current_step === 'COMPLETE') {
      router.push('/job-seeker')
      return
    }
    setFinishing(true)
    try {
      const response = await seekerApi.completeOnboarding(
        session.onboarding_session_id,
      )
      onSession(response.data.data)
      Toast.success(
        'Onboarding selesai. Profilmu siap digunakan untuk matching.',
      )
      router.push('/job-seeker')
    } catch (error) {
      handleApiError(error)
    } finally {
      setFinishing(false)
    }
  }

  return (
    <div className="space-y-5">
      <JourneyHeader
        eyebrow="Ringkasan arah karier"
        title="Profil eksplorasi kariermu"
        description="Ringkasan ini menggabungkan kecenderungan OCEAN, minat RIASEC, profil, dan jawaban Double Diamond."
        progress={100}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            {result.selected_role || 'Arah karier terpilih'}
          </CardTitle>
          <CardDescription>
            RIASEC dominan: {assessment.riasec.dominant_code} · confidence{' '}
            {Math.round(result.confidence_score * 100)}%
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-7 text-foreground">
            {result.career_summary || assessment.career_profile_summary}
          </p>
          {result.work_style_summary && (
            <SummaryBlock title="Gaya kerja" text={result.work_style_summary} />
          )}
          {result.readiness_summary && (
            <SummaryBlock title="Kesiapan" text={result.readiness_summary} />
          )}
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Kekuatan" values={result.strengths} />
        <ListCard
          title="Hambatan yang perlu disiapkan"
          values={result.barriers ?? []}
        />
      </div>
      {result.recommended_roles?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Role yang direkomendasikan</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {result.recommended_roles.map((role) => (
              <div key={role.code} className="rounded-lg border p-4">
                <div className="flex justify-between gap-3">
                  <strong>{role.label}</strong>
                  <span className="text-sm font-semibold text-primary">
                    {Math.round(role.score * 100)}%
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {role.reason}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
      <StickyAction>
        <span className="text-sm text-muted-foreground">
          Hasil ini adalah alat eksplorasi, bukan diagnosis psikologis.
        </span>
        <Button size="lg" onClick={() => void finish()} disabled={finishing}>
          {finishing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
          {session.current_step === 'COMPLETE'
            ? 'Ke dashboard'
            : 'Selesaikan onboarding'}
        </Button>
      </StickyAction>
    </div>
  )
}

function JourneyHeader({
  eyebrow,
  title,
  description,
  progress,
  status,
}: {
  eyebrow: string
  title: string
  description: string
  progress: number
  status?: ReactNode
}) {
  return (
    <header className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {status}
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-right text-xs font-semibold text-muted-foreground">
        {progress}% lengkap
      </p>
    </header>
  )
}

function SaveIndicator({
  status,
}: {
  status: 'idle' | 'saving' | 'saved' | 'error'
}) {
  const content =
    status === 'saving' ? (
      <>
        <Loader2 className="size-3.5 animate-spin" />
        Menyimpan
      </>
    ) : status === 'saved' ? (
      <>
        <Save className="size-3.5" />
        Tersimpan
      </>
    ) : status === 'error' ? (
      'Gagal menyimpan'
    ) : null
  return content ? (
    <span
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}
    >
      {content}
    </span>
  ) : null
}

function LoadingCard({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Loader2 className="size-7 animate-spin" />
        </span>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">
          Proses AI dapat membutuhkan beberapa saat.
        </p>
      </CardContent>
    </Card>
  )
}
function RetryCard({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="font-semibold">Data belum berhasil dimuat.</p>
        <Button onClick={onRetry}>
          <RefreshCw />
          Coba lagi
        </Button>
      </CardContent>
    </Card>
  )
}
function StickyAction({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-4 z-20 flex flex-col items-stretch justify-between gap-3 rounded-xl bg-card/95 p-3 shadow-sm ring-1 ring-foreground/10 backdrop-blur sm:flex-row sm:items-center">
      {children}
    </div>
  )
}
function SummaryBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <strong className="text-sm">{title}</strong>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  )
}
function ListCard({ title, values }: { title: string; values: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {values.length ? (
          <ul className="space-y-2">
            {values.map((value) => (
              <li key={value} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                {value}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada catatan.</p>
        )}
      </CardContent>
    </Card>
  )
}

function isAnswered(answer: DoubleDiamondAnswer | undefined): boolean {
  return (
    typeof answer === 'number' ||
    (typeof answer === 'string' && Boolean(answer.trim())) ||
    (Array.isArray(answer) && answer.length > 0)
  )
}
function deriveSelection(
  questions: DoubleDiamondQuestion[],
  answers: Record<string, DoubleDiamondAnswer>,
): string | undefined {
  for (const question of questions) {
    const answer = answers[question.question_id]
    if (typeof answer === 'string' && answer.trim()) return answer.trim()
    if (Array.isArray(answer) && answer.length) return answer[0]
  }
  return undefined
}
function phaseTitle(phase: DoubleDiamondPhase): string {
  return {
    DIVERGE_1: 'Buka kemungkinan karier',
    CONVERGE_1: 'Pilih bidang yang paling relevan',
    DIVERGE_2: 'Dalami cara kerja idealmu',
    CONVERGE_2: 'Tentukan role target',
  }[phase]
}
function phaseDescription(phase: DoubleDiamondPhase): string {
  return {
    DIVERGE_1:
      'Gali aktivitas, nilai, lingkungan, dan dampak kerja yang memberimu energi.',
    CONVERGE_1:
      'Konfirmasi bidang yang paling sesuai dengan evidence dari profil dan jawabanmu.',
    DIVERGE_2:
      'Eksplorasi tipe masalah, kontribusi tim, cara belajar, dan toleransi ambiguitas.',
    CONVERGE_2:
      'Perjelas role konkret, kesiapan, kekuatan, dan hambatan yang perlu disiapkan.',
  }[phase]
}
function journeyIndex(step: OnboardingCurrentStep): number {
  if (step === 'OCEAN' || step === 'RIASEC') return 1
  if (DD_PHASES.includes(step as DoubleDiamondPhase)) return 2
  if (step === 'PREFERENCE') return 3
  if (step === 'COMPLETE') return 4
  return 0
}
