import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { JobRecommendation, MatchStatus } from '@/types/seeker.types'

const STATUS_LABEL: Record<MatchStatus, string> = {
  matched: 'Matched',
  rise: 'SAKTI Rise',
  no_match: 'No Match',
}

const STATUS_STYLE: Record<MatchStatus, string> = {
  matched: 'bg-emerald-100 text-emerald-700',
  rise: 'bg-amber-100 text-amber-700',
  no_match: 'bg-slate-100 text-slate-600',
}

interface JobRecommendationsProps {
  jobs: JobRecommendation[]
}

export function JobRecommendations({ jobs }: JobRecommendationsProps) {
  if (jobs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada lowongan yang cocok. Set target role & preferensi di onboarding.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {jobs.map((job) => (
        <li
          key={job.jobId}
          className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{job.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {job.company ?? 'Perusahaan'} ·{' '}
              <span className="font-medium text-foreground">
                {Math.round(job.totalScore * 100)}% match
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge className={cn('text-[10px]', STATUS_STYLE[job.status])}>
              {STATUS_LABEL[job.status]}
            </Badge>
            <Button size="sm" variant={job.autoApplied ? 'secondary' : 'default'}>
              {job.autoApplied ? 'Auto-applied' : 'Apply'}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
