'use client';

import { seekerApi } from '@/api/seeker.api';
import { authApi } from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ParseCvResponse } from '@/types/seeker.types';
import type { UserProfile } from '@/types/auth.types';
import type { OnboardingSessionResponse } from '@/types/career-onboarding.types';
import { handleApiError } from '@/utils/api-error';
import { Toast } from '@/utils/toast';
import { AlertCircle, Check, CheckCircle2, Loader2, Sparkles, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, DragEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { RepeatableProfileForms } from './repeatable-profile-forms';
import { CareerJourney } from './career-journey';

type UploadPhase = 'idle' | 'uploading' | 'success' | 'error';

const MAX_CV_SIZE = 10 * 1024 * 1024;

const wizardSteps = [
  {
    label: 'Upload CV',
    title: 'Upload CV kamu',
    description: 'Unggah CV terbaru dalam format PDF. Sistem akan membaca isinya agar dapat kamu tinjau dan koreksi.',
  },
  {
    label: 'Identitas',
    title: 'Periksa informasi pribadi',
    description: 'Koreksi data identitas dan ringkasan profesional yang dibaca dari bagian header CV.',
  },
  {
    label: 'Pengalaman',
    title: 'Periksa pengalaman',
    description: 'Lihat jumlah pengalaman yang terdeteksi dan tambahkan riwayat yang belum tercantum di CV.',
  },
  {
    label: 'Pendidikan',
    title: 'Periksa pendidikan',
    description: 'Lengkapi pendidikan formal yang belum berhasil dibaca dari dokumen.',
  },
  {
    label: 'Sertifikasi',
    title: 'Lengkapi sertifikasi',
    description: 'Tambahkan sertifikasi profesional lain yang relevan dengan tujuan kariermu.',
  },
  {
    label: 'Skill',
    title: 'Lengkapi skill',
    description: 'Tinjau skill serta estimasi learning hours dan working hours dari CV.',
  },
  {
    label: 'Proyek',
    title: 'Lengkapi proyek',
    description: 'Tambahkan proyek yang belum ditemukan pada proses parsing CV dan lengkapi detail kontribusimu.',
  },
  {
    label: 'Tinjau',
    title: 'Tinjau profil',
    description: 'Pastikan seluruh data hasil tinjauan sudah sesuai sebelum menyimpan profil.',
  },
] as const;

const onboardingJourney = [
  { title: 'Mulai', caption: 'CV & identitas' },
  { title: 'Psikometri', caption: 'OCEAN · RIASEC' },
  { title: 'Double Diamond', caption: 'Asesmen terpersonalisasi' },
  { title: 'Preferensi', caption: 'Lokasi · Gaji · Timeline' },
  { title: 'Profil Lengkap', caption: 'Siap matching' },
] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<UploadPhase>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseCvResponse | null>(null);
  const [accountProfile, setAccountProfile] = useState<UserProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [journeySession, setJourneySession] = useState<OnboardingSessionResponse | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const step = wizardSteps[currentStep];
  const isUploading = phase === 'uploading';

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [profileResponse, sessionResponse] = await Promise.all([
          authApi.me().catch(() => null),
          seekerApi.getCurrentOnboarding(),
        ]);
        if (!active) return;
        if (profileResponse) setAccountProfile(profileResponse.data.data);
        const session = sessionResponse.data.data;
        if (!session) return;
        setJourneySession(session);
        if (session.status === 'COMPLETED') {
          router.replace('/job-seeker');
          return;
        }
        if (session.current_step === 'IDENTITY' && session.cv_id) {
          const parsedResponse = await seekerApi.getParsedCv(
            session.onboarding_session_id,
          );
          if (!active) return;
          setParseResult(parsedResponse.data.data);
          setPhase('success');
          setCurrentStep(Math.max(1, Math.min(session.profile_step, 7)));
        }
      } catch (error) {
        if (active) handleApiError(error);
      } finally {
        if (active) setBootstrapping(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  async function processCv(file: File) {
    const validationError = validatePdf(file);
    if (validationError) {
      setSelectedFile(null);
      setErrorMessage(validationError);
      setPhase('error');
      Toast.error(validationError);
      return;
    }

    setSelectedFile(file);
    setParseResult(null);
    setErrorMessage('');
    setPhase('uploading');

    try {
      const response = await seekerApi.parseCv(file);
      const sessionResponse = await seekerApi.getCurrentOnboarding();
      if (!sessionResponse.data.data) {
        throw new Error('Sesi onboarding tidak ditemukan setelah parsing CV.');
      }
      setJourneySession(sessionResponse.data.data);
      try {
        const profileResponse = await authApi.me();
        setAccountProfile(profileResponse.data.data);
      } catch {
        // Parsing remains usable when profile refresh is temporarily unavailable.
      }
      setParseResult(response.data.data);
      setCurrentStep(1);
      setPhase('success');
      Toast.success('PDF berhasil dibaca. Tinjau data yang terdeteksi.');
    } catch (error) {
      const parsed = handleApiError(error);
      setErrorMessage(parsed.message);
      setPhase('error');
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void processCv(file);
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    if (isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) void processCv(file);
  }

  function resetUpload() {
    setCurrentStep(0);
    setPhase('idle');
    setSelectedFile(null);
    setParseResult(null);
    setErrorMessage('');
    setDragActive(false);
  }

  function openFilePicker() {
    if (!isUploading) inputRef.current?.click();
  }

  function handleUploadKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFilePicker();
    }
  }

  async function navigateToStep(index: number) {
    if (index > 0 && !parseResult) {
      Toast.info('Unggah dan proses PDF terlebih dahulu.');
      return;
    }
    if (
      journeySession?.current_step === 'IDENTITY' &&
      index > journeySession.profile_step
    ) {
      try {
        const response = await seekerApi.saveProfileProgress(
          journeySession.onboarding_session_id,
          index,
        );
        setJourneySession(response.data.data);
      } catch (error) {
        handleApiError(error);
        return;
      }
    }
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function completeProfileJourney() {
    const session = journeySession ?? (await seekerApi.createOrGetOnboarding(parseResult?.cvId)).data.data;
    const response = await seekerApi.completeProfile(session.onboarding_session_id);
    setJourneySession(response.data.data);
  }

  if (bootstrapping || journeySession?.status === 'COMPLETED') {
    return <OnboardingLoading />;
  }

  if (
    journeySession &&
    journeySession.current_step !== 'CV_UPLOAD' &&
    journeySession.current_step !== 'IDENTITY'
  ) {
    return <CareerJourney initialSession={journeySession} />;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-muted/30">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card px-3 py-5 md:flex">
        <div className="flex items-center px-2 pb-6">
          <Image src="/logo-color.png" alt="SAKTI AI" width={120} height={40} className="h-9 w-auto" priority />
        </div>

        <nav aria-label="Tahapan onboarding" className="flex flex-col gap-1">
          {onboardingJourney.map((item, index) => {
            const active = index === 0;
            return (
              <div key={item.title} className={`grid min-h-14 w-full grid-cols-[24px_1fr] items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <span className={`flex size-6 items-center justify-center rounded-full text-[11px] font-semibold ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{index + 1}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{item.title}</span>
                  <span className={`mt-0.5 block text-xs leading-4 ${active ? 'text-primary/65' : 'text-muted-foreground/70'}`}>{item.caption}</span>
                </span>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-3">

          <div className="size-8 rounded-full" />
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">
          <div className="mx-auto w-[calc(100vw-2rem)] min-w-0 max-w-6xl sm:w-[calc(100vw-3rem)] md:w-full">
            <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{step.title}</h1>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            </header>

            <nav aria-label="Tahapan pengisian CV" className="mb-6 w-full max-w-full overflow-x-auto pb-2">
              <div className="grid min-w-[860px] grid-cols-8">
                {wizardSteps.map((item, index) => (
                  <button key={item.label} type="button" onClick={() => navigateToStep(index)} className="group relative flex flex-col items-center gap-2 text-center">
                    <span className="absolute left-0 right-0 top-5 h-px bg-border group-first:left-1/2 group-last:right-1/2" />
                    <span
                      className={`relative z-10 flex size-10 items-center justify-center rounded-full text-sm font-bold ${index === currentStep ? 'bg-primary text-primary-foreground ring-4 ring-primary/10' : parseResult && index < currentStep ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'}`}
                    >
                      {parseResult && index < currentStep ? <Check className="size-4" /> : index + 1}
                    </span>
                    <span className={`text-xs ${index === currentStep ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {currentStep === 0 ? (
              <UploadStep
                inputRef={inputRef}
                selectedFile={selectedFile}
                phase={phase}
                dragActive={dragActive}
                errorMessage={errorMessage}
                parseResult={parseResult}
                onInputChange={handleInputChange}
                onOpenPicker={openFilePicker}
                onUploadKeyDown={handleUploadKeyDown}
                onDrop={handleDrop}
                onDragActive={setDragActive}
                onReset={resetUpload}
                onContinue={() => navigateToStep(1)}
              />
            ) : parseResult ? (
              <RepeatableProfileForms activeStep={currentStep} parseResult={parseResult} accountProfile={accountProfile} onBack={() => navigateToStep(currentStep - 1)} onNext={() => navigateToStep(currentStep + 1)} onSaved={completeProfileJourney} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function OnboardingLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="flex items-center justify-center gap-3 py-8 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          Memulihkan progress onboarding…
        </CardContent>
      </Card>
    </div>
  );
}

function UploadStep({
  inputRef,
  selectedFile,
  phase,
  dragActive,
  errorMessage,
  parseResult,
  onInputChange,
  onOpenPicker,
  onUploadKeyDown,
  onDrop,
  onDragActive,
  onReset,
  onContinue,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  phase: UploadPhase;
  dragActive: boolean;
  errorMessage: string;
  parseResult: ParseCvResponse | null;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenPicker: () => void;
  onUploadKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragActive: (active: boolean) => void;
  onReset: () => void;
  onContinue: () => void;
}) {
  const uploading = phase === 'uploading';

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <CardTitle>Unggah CV</CardTitle>
            <CardDescription className="mt-1">Gunakan PDF berbasis teks dengan ukuran maksimal 10 MB.</CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-900">
            <Sparkles className="size-4 text-blue-600" />
          </div>
        </CardHeader>

        <CardContent>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={onInputChange} disabled={uploading} />

          {!selectedFile ? (
            <div
              role="button"
              tabIndex={0}
              aria-label="Pilih atau jatuhkan PDF CV"
              onClick={onOpenPicker}
              onKeyDown={onUploadKeyDown}
              onDragEnter={(event) => {
                event.preventDefault();
                onDragActive(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                onDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                onDragActive(false);
              }}
              onDrop={onDrop}
              className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center outline-none transition focus-visible:ring-4 focus-visible:ring-primary/15 ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/60 hover:bg-primary/[0.03]'}`}
            >
              <span className="flex size-16 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UploadCloud className="size-8" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">Tarik dan lepas PDF di sini</h3>
              <p className="mt-2 text-sm text-muted-foreground">Hanya PDF, maksimal 10 MB.</p>
              <Button type="button" size="lg" className="pointer-events-none mt-5" tabIndex={-1}>
                Pilih PDF CV
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-xs font-bold text-red-700">PDF</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{selectedFile.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    {uploading && <Loader2 className="size-4 animate-spin text-primary" />}
                    {phase === 'success' && <CheckCircle2 className="size-4 text-emerald-600" />}
                    {phase === 'error' && <AlertCircle className="size-4 text-red-600" />}
                    <span className={phase === 'error' ? 'text-red-700' : phase === 'success' ? 'text-emerald-700' : 'text-muted-foreground'}>
                      {uploading ? 'Mengekstrak teks dan memetakan data...' : phase === 'success' ? 'CV berhasil diproses' : errorMessage}
                    </span>
                  </div>
                </div>
                {!uploading && (
                  <Button type="button" variant="ghost" size="icon" onClick={onReset} title="Ganti PDF">
                    <X />
                    <span className="sr-only">Ganti PDF</span>
                  </Button>
                )}
              </div>
              {uploading && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
                </div>
              )}
            </div>
          )}

          {phase === 'error' && !selectedFile && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertCircle className="mt-0.5 size-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {parseResult && (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <CheckCircle2 className="size-5" />
                CV berhasil dibaca dan siap ditinjau
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {summaryCounts(parseResult).map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-card p-3 text-center ring-1 ring-foreground/5">
                    <strong className="block text-xl text-foreground">{value}</strong>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {parseResult && (
        <div className="sticky bottom-4 mt-5 flex justify-end rounded-xl bg-card/95 p-3 shadow-sm ring-1 ring-foreground/10 backdrop-blur">
          <Button type="button" size="lg" onClick={onContinue}>
            Periksa data berikutnya <Check />
          </Button>
        </div>
      )}
    </>
  );
}

export function summaryCounts(result: ParseCvResponse): Array<[string, number]> {
  return [
    ['Pengalaman', result.detected.experiences],
    ['Pendidikan', result.detected.educations],
    ['Sertifikasi', result.detected.certifications],
    ['Skill', result.detected.skills],
    ['Proyek', result.detected.projects],
  ];
}

function validatePdf(file: File): string | null {
  if (!file.name.toLowerCase().endsWith('.pdf')) return 'Pilih file dengan format PDF.';
  if (file.type && file.type !== 'application/pdf') return 'Pilih file PDF yang valid.';
  if (file.size === 0) return 'File PDF kosong.';
  if (file.size > MAX_CV_SIZE) return 'Ukuran PDF melebihi batas maksimal 10 MB.';
  return null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
