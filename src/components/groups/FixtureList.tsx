import { useMemo } from 'react'
import type { GroupMatch } from '../../types'
import { ScoreInput } from '../shared/ScoreInput'

interface FixtureListProps {
  matches: GroupMatch[]
  names: Map<string, string>
  onScoreChange: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void
}

export function FixtureList({ matches, names, onScoreChange }: FixtureListProps) {
  const byRound = useMemo(() => {
    const map = new Map<number, GroupMatch[]>()
    for (const m of matches) {
      const list = map.get(m.round) ?? []
      list.push(m)
      map.set(m.round, list)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [matches])

  return (
    <div className="space-y-3">
      {byRound.map(([round, roundMatches]) => (
        <div key={round}>
          <h4 className="mb-1 text-xs font-medium uppercase text-neutral-400">Rodada {round}</h4>
          <ul className="space-y-1">
            {roundMatches.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate text-right">{names.get(m.homeTeamId)}</span>
                <ScoreInput
                  value={m.homeGoals}
                  onChange={(v) => onScoreChange(m.id, v, m.awayGoals)}
                />
                <span className="text-neutral-400">×</span>
                <ScoreInput
                  value={m.awayGoals}
                  onChange={(v) => onScoreChange(m.id, m.homeGoals, v)}
                />
                <span className="flex-1 truncate">{names.get(m.awayTeamId)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
