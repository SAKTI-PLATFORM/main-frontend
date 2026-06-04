'use client'

import { useMemo } from 'react'
import { OCEAN_ITEMS, OCEAN_SCALE_LABELS, RIASEC_ITEMS } from '@/features/onboarding/constants'
import { LikertScale } from '../likert-scale'

export type OceanAnswers = Record<number, number>
export type RiasecAnswers = Record<number, number>

interface Props {
  ocean: OceanAnswers
  riasec: RiasecAnswers
  onOcean: (index: number, value: number) => void
  onRiasec: (item: number, value: number) => void
}

function shuffle<T>(items: T[]): T[] {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)
}

export function AssessmentStep({ ocean, riasec, onOcean, onRiasec }: Props) {
  const riasecOrder = useMemo(() => shuffle(RIASEC_ITEMS), [])

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <h3 className="text-xl font-bold text-gray-900">Big Five OCEAN</h3>
        {OCEAN_ITEMS.map((item, index) => (
          <div key={index} className="space-y-3">
            <p className="text-sm font-medium underline underline-offset-2 text-gray-800">
              {item.statement}
            </p>
            <LikertScale
              value={ocean[index]}
              onChange={(value) => onOcean(index, value)}
              minLabel={OCEAN_SCALE_LABELS[0]}
              maxLabel={OCEAN_SCALE_LABELS[OCEAN_SCALE_LABELS.length - 1]}
              points={7}
            />
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <h3 className="text-xl font-bold text-gray-900">Holland RIASEC</h3>
        {riasecOrder.map((item) => (
          <div key={item.item} className="space-y-3">
            <p className="text-sm font-medium underline underline-offset-2 text-gray-800">
              {item.statement}
            </p>
            <LikertScale
              value={riasec[item.item]}
              onChange={(value) => onRiasec(item.item, value)}
              minLabel="Tidak Suka"
              maxLabel="Suka"
              points={3}
            />
          </div>
        ))}
      </section>
    </div>
  )
}
