'use client'

import { seekerApi } from '@/api/seeker.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ParseCvResponse } from '@/types/seeker.types'
import { handleApiError } from '@/utils/api-error'
import { Toast } from '@/utils/toast'
import { AlertCircle, Loader2, UploadCloud } from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

const POLL_INTERVAL_MS = 3000

/**
 * Blocks on the CV finishing background parsing (see ParseCvUseCase on the
 * backend). OCEAN/RIASEC never need this — they run before the CV has to be
 * ready — but the profile review step (IDENTITY) does, since it prefills
 * from the parsed result. Polls until it's ready, or offers a retry upload
 * if parsing failed.
 */
export function CvProcessingGate({
  onboardingSessionId,
  onReady,
}: {
  onboardingSessionId: string
  onReady: (result: ParseCvResponse) => void
}) {
  const [failed, setFailed] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let active = true
    let timer: number | undefined

    const poll = async () => {
      try {
        const response = await seekerApi.getParsedCv(onboardingSessionId)
        if (!active) return
        const data = response.data.data
        if (data.status === 'PARSED') {
          onReady(data)
          return
        }
        setFailed(data.status === 'FAILED')
        timer = window.setTimeout(() => void poll(), POLL_INTERVAL_MS)
      } catch (error) {
        if (!active) return
        handleApiError(error)
        timer = window.setTimeout(() => void poll(), POLL_INTERVAL_MS)
      }
    }

    void poll()
    return () => {
      active = false
      if (timer) window.clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onReady is a fresh closure per render; only session id should restart polling.
  }, [onboardingSessionId])

  async function retryUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setRetrying(true)
    try {
      await seekerApi.parseCv(file)
      setFailed(false)
      Toast.success('CV baru sedang diproses ulang.')
    } catch (error) {
      handleApiError(error)
    } finally {
      setRetrying(false)
    }
  }

  if (failed) {
    return (
      <Card className="border-[#ECECF2]">
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="size-7" />
          </span>
          <p className="font-semibold text-[#20202A]">CV gagal diproses.</p>
          <p className="max-w-sm text-sm text-[#6C6C7A]">
            Coba unggah ulang PDF CV kamu. Jawaban OCEAN dan RIASEC yang sudah kamu isi tetap tersimpan.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(event) => void retryUpload(event)}
            disabled={retrying}
          />
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={retrying}
            className="bg-[#4138D8] text-white hover:bg-[#3315B8]"
          >
            {retrying ? <Loader2 className="animate-spin" /> : <UploadCloud />}
            Unggah ulang PDF
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#ECECF2]">
      <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#EFEEFF] text-[#4138D8]">
          <Loader2 className="size-7 animate-spin" />
        </span>
        <p className="font-semibold text-[#20202A]">SAKTI AI masih membaca CV kamu...</p>
        <p className="max-w-sm text-sm text-[#6C6C7A]">
          Proses ini berjalan di latar belakang sejak CV diunggah. Tinjauan profil akan tampil otomatis begitu selesai.
        </p>
      </CardContent>
    </Card>
  )
}
