import type { LegsMode } from '../../types'
import type { ResolvedMatch } from '../../lib/bracket'
import { MatchCard, type MatchCardHandlers } from './MatchCard'

interface KnockoutTableProps extends MatchCardHandlers {
  roundsData: ResolvedMatch[][]
  thirdPlaceEntry: ResolvedMatch | null
  legsMode: LegsMode
}

export function KnockoutTable({ roundsData, thirdPlaceEntry, legsMode, ...handlers }: KnockoutTableProps) {
  return (
    <div className="space-y-8">
      {roundsData.map((matches, r) => (
        <div key={r}>
          <h3 className="mb-2 text-sm font-semibold text-neutral-400">
            {matches[0]?.phase}
          </h3>
          <div className="flex flex-wrap gap-4">
            {matches.map((m) => (
              <MatchCard key={m.key} match={m} legsMode={legsMode} {...handlers} />
            ))}
          </div>
        </div>
      ))}
      {thirdPlaceEntry && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-neutral-400">
            Disputa de 3º lugar
          </h3>
          <MatchCard match={thirdPlaceEntry} legsMode={legsMode} {...handlers} />
        </div>
      )}
    </div>
  )
}
