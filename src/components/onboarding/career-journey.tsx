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
import { CvProcessingGate } from '@/components/onboarding/cv-processing-gate'
import { LikertScale } from '@/components/onboarding/likert-scale'
import { onboardingStageIndex, OnboardingSidebar } from '@/components/onboarding/onboarding-sidebar'
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
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Dices,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

const STEP_LABELS: Record<OnboardingCurrentStep, string> = {
  CV_UPLOAD: 'Upload CV',
  IDENTITY: 'Tinjau profil',
  OCEAN: 'OCEAN',
  RIASEC: 'RIASEC',
  DIVERGE_1: 'Eksplorasi bidang',
  CONVERGE_1: 'Pilih bidang',
  DIVERGE_2: 'Eksplorasi role',
  CONVERGE_2: 'Pilih role',
  PREFERENCE: 'Ringkasan akhir',
  COMPLETE: 'Selesai',
}

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

  return (
    // No overflow-x here — setting it computes overflow-y to `auto` too,
    // which turns this div into its own scroll container and traps
    // OnboardingSidebar's `sticky` inside it instead of the viewport. The
    // inner <main> below already clips any horizontal overflow.
    <div className="flex min-h-screen bg-[#F7F7FA]">
      <OnboardingSidebar activeIndex={onboardingStageIndex(session.current_step)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[#ECECF2] bg-[#F7F7FA] px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <span className="text-[#9A9AAB]">Onboarding</span>
            <span className="text-[#C7C7D2]">/</span>
            <span className="font-semibold text-[#26262F]">{STEP_LABELS[session.current_step]}</span>
          </nav>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-8">
          <div className="mx-auto max-w-4xl">
          {(session.current_step === 'OCEAN' ||
            session.current_step === 'RIASEC') && (
            <>
              <div className="mb-4 flex justify-end">
                <CvBackgroundStatus
                  onboardingSessionId={session.onboarding_session_id}
                />
              </div>
              <AssessmentPanel
                session={session}
                type={session.current_step}
                onAdvance={(step) =>
                  setSession((current) => ({ ...current, current_step: step }))
                }
              />
            </>
          )}
          {session.current_step === 'IDENTITY' && (
            <IdentityHandoff session={session} />
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
    </div>
  )
}

// RIASEC hands current_step to IDENTITY as soon as it's submitted, whether
// or not the CV has finished parsing — this panel is what the job seeker
// sees in that instant. It waits for the CV (retrying on failure) and then
// bounces into the onboarding wizard, which owns the profile review UI.
function IdentityHandoff({ session }: { session: OnboardingSessionResponse }) {
  return (
    <div className="space-y-4">
      <JourneyHeader
        eyebrow="Menyiapkan profil"
        title="Menyelesaikan pembacaan CV"
        description="OCEAN dan RIASEC-mu sudah tersimpan. Begitu SAKTI AI selesai membaca CV, kamu akan diarahkan ke tinjauan profil."
        progress={100}
      />
      <CvProcessingGate
        onboardingSessionId={session.onboarding_session_id}
        // A full reload, not router.replace: we're already sitting on
        // /job-seeker/onboarding (CareerJourney renders inline under that
        // same URL), so a client-side "navigation" to the identical route is
        // a no-op in the App Router — nothing remounts, the parent
        // OnboardingWizard never re-runs its bootstrap, and the job seeker
        // is stuck on this screen even after the CV finishes parsing. A hard
        // reload forces OnboardingWizard to mount fresh and pick up the
        // now-PARSED CV.
        onReady={() => {
          window.location.href = '/job-seeker/onboarding'
        }}
      />
    </div>
  )
}

// Passive indicator shown while filling OCEAN/RIASEC so it's visible that the
// CV really is being parsed concurrently, not just stuck. Never blocks
// anything — a failed fetch here just leaves it hidden.
function CvBackgroundStatus({
  onboardingSessionId,
}: {
  onboardingSessionId: string
}) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'failed'>('idle')

  useEffect(() => {
    let active = true
    let timer: number | undefined

    const poll = async () => {
      try {
        const response = await seekerApi.getParsedCv(onboardingSessionId)
        if (!active) return
        const data = response.data.data
        if (data.status === 'PARSING') {
          setStatus('processing')
          timer = window.setTimeout(() => void poll(), 4000)
        } else if (data.status === 'FAILED') {
          setStatus('failed')
        } else {
          setStatus('idle')
        }
      } catch {
        // Silent — this is a passive background indicator, not the primary flow.
      }
    }

    void poll()
    return () => {
      active = false
      if (timer) window.clearTimeout(timer)
    }
  }, [onboardingSessionId])

  if (status === 'idle') return null
  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-[#EFEEFF] text-[#4138D8]'}`}
    >
      {status === 'failed' ? (
        <AlertCircle className="size-3.5" />
      ) : (
        <Loader2 className="size-3.5 animate-spin" />
      )}
      {status === 'failed' ? 'CV gagal diproses' : 'CV sedang diproses di latar belakang'}
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
    dirty.current = false
    try {
      const response = await seekerApi.getAssessmentQuestions(
        session.onboarding_session_id,
        type,
      )
      setData(response.data.data)
      setAnswers(response.data.data.existing_responses ?? {})
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
        .catch(() => {
          // Draft autosave — a transient failure must not pop a blocking
          // dialog or bounce the page mid-assessment. The final `submit`
          // re-saves every answer and surfaces real errors there.
          setSaveStatus('error')
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

  const autofill = () => {
    dirty.current = true
    setSaveStatus('idle')
    setAnswers(
      Object.fromEntries(
        data.questions.map((question) => [
          question.question_id,
          1 + Math.floor(Math.random() * 5),
        ]),
      ),
    )
  }

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
        status={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={autofill}
              className="gap-1.5 border-[#E4E3F0] text-[#6E6E86] hover:border-[#CFC8FF] hover:bg-[#F4F3FB] hover:text-[#4138D8]"
            >
              <Dices className="size-3.5" />
              Isi otomatis
            </Button>
            <SaveIndicator status={saveStatus} />
          </div>
        }
      />
      {data.questions.map((question) => (
        <Card key={question.question_id} size="sm" className="border-[#ECECF2]">
          <CardHeader>
            <CardTitle className="text-lg leading-7 text-[#20202A]">
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
        <span className="text-sm text-[#6C6C7A]">
          {complete
            ? 'Semua jawaban lengkap.'
            : `${data.questions.length - Object.keys(answers).length} pertanyaan belum dijawab.`}
        </span>
        <Button
          size="lg"
          disabled={!complete || submitting}
          onClick={() => void submit()}
          className="bg-[#4138D8] text-white hover:bg-[#3315B8]"
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
          ? deriveSelection(phase, data.questions, answers)
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
        <Card key={question.question_id} className="border-[#ECECF2]">
          <CardHeader>
            <CardDescription className="text-[#9293A2]">
              {question.question_code} · Pertanyaan {index + 1}
            </CardDescription>
            <CardTitle className="text-lg leading-7 text-[#20202A]">
              {question.question_text}
            </CardTitle>
            {question.helper_text && (
              <p className="text-sm text-[#6C6C7A]">
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
        <span className="text-sm text-[#6C6C7A]">
          {complete
            ? 'Semua jawaban wajib lengkap.'
            : 'Lengkapi pertanyaan wajib untuk melanjutkan.'}
        </span>
        <Button
          size="lg"
          disabled={!complete || submitting}
          onClick={() => void submit()}
          className="bg-[#4138D8] text-white hover:bg-[#3315B8]"
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
        className="w-full rounded-lg border border-[#E4E3F0] bg-white px-3 py-2 text-sm text-[#20202A] outline-none focus-visible:border-[#4138D8] focus-visible:ring-3 focus-visible:ring-[#4138D8]/15"
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
          className="w-full accent-[#4138D8]"
        />
        <div className="flex justify-between text-sm text-[#9293A2]">
          <span>{min}</span>
          <strong className="text-[#4138D8]">
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
            className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${answer === option.code ? 'border-[#4138D8] bg-[#4138D8]/5 ring-2 ring-[#4138D8]/10' : 'border-[#E4E3F0] hover:bg-[#F4F3FB]'}`}
          >
            <span
              className={`size-4 rounded-full border ${answer === option.code ? 'border-[5px] border-[#4138D8]' : 'border-[#D8D5ED]'}`}
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
            className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${active ? 'border-[#4138D8] bg-[#4138D8]/5' : 'border-[#E4E3F0] hover:bg-[#F4F3FB]'}`}
          >
            <span
              className={`flex size-5 items-center justify-center rounded ${active ? 'bg-[#4138D8] text-xs font-bold text-white' : 'border border-[#D8D5ED]'}`}
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
      <Card className="border-[#ECECF2]">
        <CardHeader>
          <CardTitle className="text-[#20202A]">
            {resolveSelectedRole(result) || 'Arah karier terpilih'}
          </CardTitle>
          <CardDescription className="text-[#6C6C7A]">
            RIASEC dominan: {assessment.riasec.dominant_code} · confidence{' '}
            {Math.round(result.confidence_score * 100)}%
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-7 text-[#3B3B4C]">
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
        <Card className="border-[#ECECF2]">
          <CardHeader>
            <CardTitle className="text-[#20202A]">Role yang direkomendasikan</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {result.recommended_roles.map((role) => (
              <div key={role.code} className="rounded-lg border border-[#ECECF2] p-4">
                <div className="flex justify-between gap-3">
                  <strong className="text-[#20202A]">{role.label}</strong>
                  <span className="text-sm font-semibold text-[#4138D8]">
                    {Math.round(role.score * 100)}%
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#6C6C7A]">
                  {role.reason}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
      <StickyAction>
        <span className="text-sm text-[#6C6C7A]">
          Hasil ini adalah alat eksplorasi, bukan diagnosis psikologis.
        </span>
        <Button size="lg" onClick={() => void finish()} disabled={finishing} className="bg-[#4138D8] text-white hover:bg-[#3315B8]">
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
    <header className="rounded-xl border border-[#ECECF2] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#4138D8] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[#20202A]">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6C6C7A]">
            {description}
          </p>
        </div>
        {status}
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EEEEF3]">
        <div
          className="h-full rounded-full bg-[#4138D8] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-right text-xs font-semibold text-[#9A9AAB]">
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
    <Card className="border-[#ECECF2]">
      <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#EFEEFF] text-[#4138D8]">
          <Loader2 className="size-7 animate-spin" />
        </span>
        <p className="font-semibold text-[#20202A]">{label}</p>
        <p className="text-sm text-[#6C6C7A]">
          Proses AI dapat membutuhkan beberapa saat.
        </p>
      </CardContent>
    </Card>
  )
}
function RetryCard({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="border-[#ECECF2]">
      <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="font-semibold text-[#20202A]">Data belum berhasil dimuat.</p>
        <Button onClick={onRetry} className="bg-[#4138D8] text-white hover:bg-[#3315B8]">
          <RefreshCw />
          Coba lagi
        </Button>
      </CardContent>
    </Card>
  )
}
function StickyAction({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-4 z-20 flex flex-col items-stretch justify-between gap-3 rounded-xl bg-white/95 p-3 shadow-sm ring-1 ring-[#ECECF2] backdrop-blur sm:flex-row sm:items-center">
      {children}
    </div>
  )
}
function SummaryBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg bg-[#FAFAFC] p-4">
      <strong className="text-sm text-[#20202A]">{title}</strong>
      <p className="mt-1 text-sm leading-6 text-[#6C6C7A]">{text}</p>
    </div>
  )
}
function ListCard({ title, values }: { title: string; values: string[] }) {
  return (
    <Card className="border-[#ECECF2]">
      <CardHeader>
        <CardTitle className="text-lg text-[#20202A]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {values.length ? (
          <ul className="space-y-2">
            {values.map((value) => (
              <li key={value} className="flex gap-2 text-sm text-[#3B3B4C]">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                {value}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#6C6C7A]">Belum ada catatan.</p>
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
  phase: DoubleDiamondPhase,
  questions: DoubleDiamondQuestion[],
  answers: Record<string, DoubleDiamondAnswer>,
): string | undefined {
  const selectionTerms =
    phase === 'CONVERGE_2'
      ? /role|posisi|jabatan|profesi|pekerjaan/i
      : /bidang|area|industri|sektor/i
  const confirmationTerms = /konfirmasi|setuju|sesuai|yakin/i
  const orderedQuestions = [...questions].sort((left, right) => {
    const score = (question: DoubleDiamondQuestion) => {
      const context = `${question.question_code} ${question.question_text} ${question.helper_text ?? ''}`
      return Number(selectionTerms.test(context)) * 2 - Number(confirmationTerms.test(context))
    }
    return score(right) - score(left)
  })

  for (const question of orderedQuestions) {
    const answer = answers[question.question_id]
    const value =
      typeof answer === 'string' ? answer.trim() : Array.isArray(answer) ? answer[0] : ''
    if (!value) continue
    const label = question.options.find((option) => option.code === value)?.label ?? value
    if (!isConfirmationAnswer(label)) return value
  }
  return undefined
}

function resolveSelectedRole(result: DoubleDiamondResultResponse): string | null {
  const selectedRole = result.selected_role?.trim()
  if (selectedRole && isRecommendedRole(selectedRole, result)) return selectedRole
  return result.recommended_roles?.[0]?.label ?? null
}

function isConfirmationAnswer(value: string): boolean {
  return /^(ya|iya|tidak|setuju|saya setuju|sangat setuju|sesuai|sudah sesuai)\b/i.test(
    value.trim(),
  )
}

// `selected_role` occasionally comes back holding a barrier/other free-text
// answer instead of an actual role (backend result generation bug). Only
// trust it once it matches one of the AI-recommended role candidates so a
// stray answer like "Keterbatasan sumber daya" can't surface as the target role.
function isRecommendedRole(value: string, result: DoubleDiamondResultResponse): boolean {
  if (isConfirmationAnswer(value)) return false
  const roleLabels = result.recommended_roles?.map((role) => role.label.trim()) ?? []
  if (roleLabels.length === 0) return true
  return roleLabels.some((label) => label.toLowerCase() === value.toLowerCase())
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
