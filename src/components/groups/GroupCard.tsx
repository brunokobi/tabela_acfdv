import { useMemo } from 'react'
import type { GroupMatch, Team, Tiebreaker } from '../../types'
import { computeStandings } from '../../lib/standings'
import { GroupTable } from './GroupTable'
import { FixtureList } from './FixtureList'

interface GroupCardProps {
  groupName: string
  teams: Team[]
  matches: GroupMatch[]
  tiebreakers: Tiebreaker[]
  qualifiersPerGroup: number
  onScoreChange: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void
}

export function GroupCard({
  groupName,
  teams,
  matches,
  tiebreakers,
  qualifiersPerGroup,
  onScoreChange,
}: GroupCardProps) {
  const standings = useMemo(
    () => computeStandings(teams, matches, tiebreakers),
    [teams, matches, tiebreakers],
  )
  const names = useMemo(() => new Map(teams.map((t) => [t.id, t.name])), [teams])

  return (
    <div className="rounded-lg border border-neutral-800 p-4">
      <h3 className="mb-3 font-semibold">Grupo {groupName}</h3>
      <GroupTable standings={standings} names={names} qualifiersPerGroup={qualifiersPerGroup} />
      <FixtureList matches={matches} names={names} onScoreChange={onScoreChange} />
    </div>
  )
}
