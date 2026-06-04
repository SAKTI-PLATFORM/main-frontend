import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardResponse } from '@/types/seeker.types'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

interface ProfileCardProps {
  profile: DashboardResponse['profile']
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const tags = [profile.targetRole, profile.field].filter(Boolean) as string[]

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
          {initials(profile.fullName)}
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight">{profile.fullName}</p>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> Indonesia
        </p>
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          Open for Opportunities
        </Badge>
      </CardContent>
    </Card>
  )
}
