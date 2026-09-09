// Skill-gap proficiency is a 0-100 score end to end (SAKTI-AI emits it,
// the backend stores it as TINYINT). These helpers render it and tolerate
// pre-migration `result_json` runs that still carry the old tier strings.

// Representative scores for the legacy tiers — kept in sync with SAKTI-AI
// `_TIER_SCORE` and the DB migration.
const LEGACY_TIER_SCORE: Record<string, number> = {
  none: 5,
  beginner: 35,
  intermediate: 60,
  advanced: 85,
  expert: 100,
  'tidak ada': 5,
  'belum ada': 5,
  pemula: 35,
  menengah: 60,
  mahir: 85,
  ahli: 100,
}

/** Coerce a skill-gap level field to a 0-100 number (number passthrough,
 *  legacy tier string mapped, anything else → 50). */
export function toSkillScore(value: number | string | null | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, Math.round(value)))
  }
  if (typeof value === 'string') {
    const mapped = LEGACY_TIER_SCORE[value.trim().toLowerCase()]
    if (mapped !== undefined) return mapped
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return Math.max(0, Math.min(100, Math.round(parsed)))
  }
  return 50
}

/** Short Indonesian band label for a 0-100 proficiency score. */
export function skillScoreLabel(score: number): string {
  if (score >= 90) return 'Ahli'
  if (score >= 70) return 'Mahir'
  if (score >= 45) return 'Menengah'
  if (score >= 20) return 'Pemula'
  return 'Belum ada'
}
