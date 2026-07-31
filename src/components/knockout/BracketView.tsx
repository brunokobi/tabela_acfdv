import type { LegsMode } from '../../types'
import type { ResolvedMatch } from '../../lib/bracket'
import { MatchCard, type MatchCardHandlers } from './MatchCard'

interface BracketViewProps extends MatchCardHandlers {
  roundsData: ResolvedMatch[][]
  thirdPlaceEntry: ResolvedMatch | null
  legsMode: LegsMode
}

export function BracketView({ roundsData, thirdPlaceEntry, legsMode, ...handlers }: BracketViewProps) {
  const columnHeight = (roundsData[0]?.length ?? 1) * 150

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-10">
        {roundsData.map((matches, r) => (
          <div key={r} style={{ minWidth: 256 }}>
            <h3 className="mb-3 text-center text-xs font-semibold uppercase text-neutral-400">
              {matches[0]?.phase}
            </h3>
            <div className="flex flex-col justify-around gap-4" style={{ height: columnHeight }}>
              {matches.map((m) => (
                <MatchCard key={m.key} match={m} legsMode={legsMode} {...handlers} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {thirdPlaceEntry && (
        <div className="mt-8">
          <h3 className="mb-3 text-xs font-semibold uppercase text-neutral-400">Disputa de 3º lugar</h3>
          <MatchCard match={thirdPlaceEntry} legsMode={legsMode} {...handlers} />
        </div>
      )}
    </div>
  )
}
