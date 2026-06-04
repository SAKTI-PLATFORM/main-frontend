'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { seekerApi } from '@/api/seeker.api';
import { Button } from '@/components/ui/button';
import { OCEAN_ITEMS, RIASEC_ITEMS } from '@/features/onboarding/constants';
import type { AssessmentPayload } from '@/types/seeker.types';
import { handleApiError } from '@/utils/api-error';
import { Toast } from '@/utils/toast';
import { AssessmentStep, type OceanAnswers, type RiasecAnswers } from './steps/assessment-step';
import { ExpertiseStep, type ExpertiseState } from './steps/expertise-step';
import { FoundationStep, type FoundationState } from './steps/foundation-step';
import { VisionStep, type VisionState } from './steps/vision-step';

const STEP_IMAGES: (string | null)[] = [
  '/foundation.png',
  '/expertise.png',
  '/inner.png',
  '/vision.png',
]

const STEPS = [
  {
    number: '01',
    title: 'The Foundation',
    subtitle: 'Profil Dasar',
    description: 'Profil dasar tentang dirimu. Bantu kami mengenal latar belakang dan pengalaman awalmu.',
  },
  {
    number: '02',
    title: 'Your Expertise',
    subtitle: 'Skill Self Decloration',
    description: 'Ceritakan keahlian dan tools yang kamu kuasai. Bantu kami memahami kompetensi teknismu.',
  },
  {
    number: '03',
    title: 'The Inner You',
    subtitle: 'Asesmen Psikometrik',
    description: 'Temukan kecocokan budaya kerja yang tepat. Bantu kami memahami karakter dan minat kariemu secara mendalam.',
  },
  {
    number: '04',
    title: 'Your Vision',
    subtitle: 'Preferensi Karier',
    description: 'Preferensi karier impianmu. Ceritakan lingkungan kerja ideal dan target peran yang kamu inginkan.',
  },
] as const;

interface OnboardingWizardProps {
  /** Resume at this step (0-based) — derived from saved onboarding progress. */
  initialStep?: number;
}

export function OnboardingWizard({ initialStep = 0 }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(() =>
    Math.min(Math.max(initialStep, 0), STEPS.length - 1),
  );
  const [submitting, setSubmitting] = useState(false);

  const [foundation, setFoundation] = useState<FoundationState>({});
  const [expertise, setExpertise] = useState<ExpertiseState>({
    tools: [],
    knowledgeAreas: [],
    softSkillsRanked: [],
  });
  const [ocean, setOcean] = useState<OceanAnswers>({});
  const [riasec, setRiasec] = useState<RiasecAnswers>({});
  const [vision, setVision] = useState<VisionState>({
    targetRole: '',
    workModes: [],
    companyTypes: [],
    jobTypes: [],
  });

  async function submitFoundation(): Promise<void> {
    if (!foundation.phoneNumber?.trim() || !foundation.dob) {
      throw new Error('Lengkapi nomor telepon dan tanggal lahir.');
    }
    if (!foundation.gender || !foundation.employmentStatus || !foundation.educationLevel || !foundation.field) {
      throw new Error('Lengkapi semua pilihan di langkah ini.');
    }
    await seekerApi.foundation({
      phoneNumber: foundation.phoneNumber.trim(),
      dob: foundation.dob,
      gender: foundation.gender,
      employmentStatus: foundation.employmentStatus,
      educationLevel: foundation.educationLevel,
      field: foundation.field,
    });
  }

  async function submitExpertise(): Promise<void> {
    if (expertise.tools.length === 0) {
      throw new Error('Pilih minimal satu tool yang kamu kuasai.');
    }
    if (expertise.tools.some((tool) => !tool.experience)) {
      throw new Error('Tentukan lama pengalaman untuk setiap tool.');
    }
    await seekerApi.expertise({
      tools: expertise.tools,
      knowledgeAreas: expertise.knowledgeAreas,
      softSkillsRanked: expertise.softSkillsRanked,
    });
  }

  async function submitAssessment(): Promise<void> {
    const oceanResponses: AssessmentPayload['oceanResponses'] = OCEAN_ITEMS.map((item, index) => ({
      trait: item.trait,
      polarity: item.polarity,
      value: ocean[index],
    }));
    if (oceanResponses.some((r) => !r.value)) {
      throw new Error('Jawab seluruh pernyataan kepribadian (1-7).');
    }
    if (RIASEC_ITEMS.some((item) => riasec[item.item] === undefined)) {
      throw new Error('Jawab seluruh pernyataan minat (1-3).');
    }
    const riasecResponses: AssessmentPayload['riasecResponses'] = RIASEC_ITEMS.map((item) => ({
      item: item.item,
      letter: item.letter,
      agreed: (riasec[item.item] ?? 1) >= 3,
    }));
    await seekerApi.assessment({ oceanResponses, riasecResponses });
  }

  async function submitVision(): Promise<void> {
    if (!vision.targetRole.trim()) {
      throw new Error('Isi target role yang kamu tuju.');
    }
    if (vision.workModes.length === 0 || vision.jobTypes.length === 0) {
      throw new Error('Pilih minimal satu mode kerja dan tipe pekerjaan.');
    }
    await seekerApi.vision({
      targetRole: vision.targetRole.trim(),
      workModes: vision.workModes,
      salaryMin: vision.salaryMin,
      salaryMax: vision.salaryMax,
      companyTypes: vision.companyTypes,
      jobTypes: vision.jobTypes,
    });
  }

  const submitters = [submitFoundation, submitExpertise, submitAssessment, submitVision];

  async function handleNext(): Promise<void> {
    setSubmitting(true);
    try {
      await submitters[step]();
      if (step < STEPS.length - 1) {
        setStep(step + 1);
      } else {
        Toast.success('Profil berhasil disimpan!');
        router.push('/job-seeker');
      }
    } catch (caught) {
      handleApiError(caught);
    } finally {
      setSubmitting(false);
    }
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="flex items-center px-6 py-4 border-b border-gray-100">
        <Image src="/logo-color.png" alt="SAKTI Ai" width={120} height={40} className="h-10 w-auto" priority />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 ">
        <div className="w-full max-w-[800px] bg-white px-16 py-4 shadow-lg rounded-xl border border-gray-100">
          {/* Hero */}
          <div className="flex flex-col justify-center items-center text-center mb-8">
            <Image src="/header-onboarding.png" alt="Lets find your Future Path with SAKTI Ai" width={300} height={60} className="w-48 pb-2 text-center h-auto" priority />
            <p className="text-xs text-gray-400 max-w-xs text-center mx-auto leading-relaxed">Jembatan cerdas yang menghubungkan potensimu dengan karir impian melalui analisis AI yang akurat </p>
          </div>

          {/* Step Indicator */}
          <div className="relative flex items-start w-full mb-6">
            {/* Gray base line through all nodes */}
            <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-0.5 bg-gray-200" />
            {/* Primary progress line */}
            <div
              className="absolute top-[18px] left-[12.5%] h-0.5 bg-primary transition-all duration-300"
              style={{ width: `${(step / (STEPS.length - 1)) * 75}%` }}
            />
            {STEPS.map((s, i) => (
              <div key={s.number} className="relative z-10 flex flex-col items-center" style={{ width: '25%' }}>
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {s.number}
                </div>
                <p className={`text-[10px] font-semibold text-center mt-1.5 leading-tight ${i <= step ? 'text-primary' : 'text-gray-400'}`}>{s.title}</p>
                <p className="text-[9px] text-gray-400 text-center leading-tight">({s.subtitle})</p>
              </div>
            ))}
          </div>

          {/* Active Step Card */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-r from-blue-50/60 to-white p-5 mb-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-extrabold text-primary leading-none">{current.number}</span>
                </div>
                <h2 className="text-base font-bold text-gray-800 mb-1">
                  <em>{current.title}</em> <span className="font-normal not-italic text-sm text-gray-500">({current.subtitle})</span>
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">{current.description}</p>
              </div>
              {STEP_IMAGES[step] ? (
                <Image
                  src={STEP_IMAGES[step]!}
                  alt={current.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-xl shrink-0 object-cover"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-xl shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2701C3 0%, #FF6118 100%)', opacity: 0.85 }}
                />
              )}
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {step === 0 && <FoundationStep value={foundation} onChange={(patch) => setFoundation((prev) => ({ ...prev, ...patch }))} />}
            {step === 1 && <ExpertiseStep value={expertise} onChange={(patch) => setExpertise((prev) => ({ ...prev, ...patch }))} />}
            {step === 2 && <AssessmentStep ocean={ocean} riasec={riasec} onOcean={(index, value) => setOcean((prev) => ({ ...prev, [index]: value }))} onRiasec={(item, value) => setRiasec((prev) => ({ ...prev, [item]: value }))} />}
            {step === 3 && <VisionStep value={vision} onChange={(patch) => setVision((prev) => ({ ...prev, ...patch }))} />}
          </div>

          {/* Footer */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={step === 0 || submitting}
              className="rounded-full px-8 border-gray-300"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            >
              Back
            </Button>
            <Button onClick={handleNext} disabled={submitting} className="rounded-full px-8 bg-primary text-white hover:bg-primary/90">
              {submitting ? 'Menyimpan…' : isLast ? 'Selesai' : 'Continue'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
