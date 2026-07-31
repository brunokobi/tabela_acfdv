import type { Leg, LegsMode } from '../../types'
import type { ResolvedMatch } from '../../lib/bracket'
import { ScoreInput } from '../shared/ScoreInput'
import { cn } from '../../lib/cn'

export interface MatchCardHandlers {
  onLegChange: (key: string, legIndex: number, side: 'home' | 'away', value: number | null) => void
  onPenaltyChange: (key: string, side: 'home' | 'away', value: number | null) => void
  onWOChange: (key: string, side: 'home' | 'away' | null) => void
}

interface MatchCardProps extends MatchCardHandlers {
  match: ResolvedMatch
  legsMode: LegsMode
  homeRowRef?: (el: HTMLDivElement | null) => void
  awayRowRef?: (el: HTMLDivElement | null) => void
}

const EMPTY_LEG: Leg = { homeGoals: null, awayGoals: null }

export function MatchCard({
  match,
  legsMode,
  onLegChange,
  onPenaltyChange,
  onWOChange,
  homeRowRef,
  awayRowRef,
}: MatchCardProps) {
  const { key, home, away, homeName, awayName, record, winner, needsPens } = match
  const legCount = legsMode === 'double' ? 2 : 1
  const legs = record?.legs ?? Array.from({ length: legCount }, () => EMPTY_LEG)
  const disabled = !home || !away

  return (
    <div className="w-64 rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-sm shadow-sm">
      <p className="mb-2 text-xs font-medium uppercase text-neutral-400">{match.phase}</p>
      <TeamRow
        rowRef={homeRowRef}
        name={homeName}
        isWinner={winner != null && winner === home}
        legs={legs}
        side="home"
        disabled={disabled}
        onLegChange={(legIndex, v) => onLegChange(key, legIndex, 'home', v)}
        onWO={() => onWOChange(key, record?.wo === 'home' ? null : 'home')}
        woActive={record?.wo === 'home'}
      />
      <TeamRow
        rowRef={awayRowRef}
        name={awayName}
        isWinner={winner != null && winner === away}
        legs={legs}
        side="away"
        disabled={disabled}
        onLegChange={(legIndex, v) => onLegChange(key, legIndex, 'away', v)}
        onWO={() => onWOChange(key, record?.wo === 'away' ? null : 'away')}
        woActive={record?.wo === 'away'}
      />
      {needsPens && (
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-neutral-800 pt-2 text-xs text-neutral-500">
          <span>Pênaltis</span>
          <div className="flex items-center gap-1">
            <ScoreInput
              value={record?.penalties?.home ?? null}
              onChange={(v) => onPenaltyChange(key, 'home', v)}
            />
            <span>×</span>
            <ScoreInput
              value={record?.penalties?.away ?? null}
              onChange={(v) => onPenaltyChange(key, 'away', v)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface TeamRowProps {
  name: string
  isWinner: boolean
  legs: Leg[]
  side: 'home' | 'away'
  disabled: boolean
  onLegChange: (legIndex: number, value: number | null) => void
  onWO: () => void
  woActive: boolean
  rowRef?: (el: HTMLDivElement | null) => void
}

function TeamRow({ name, isWinner, legs, side, disabled, onLegChange, onWO, woActive, rowRef }: TeamRowProps) {
  return (
    <div
      ref={rowRef}
      className={cn('flex items-center gap-2 py-1', isWinner && 'font-semibold text-emerald-400')}
    >
      <span className="flex-1 truncate">{name}</span>
      {legs.map((leg, i) => (
        <ScoreInput
          key={i}
          value={side === 'home' ? leg.homeGoals : leg.awayGoals}
          onChange={(v) => onLegChange(i, v)}
          disabled={disabled}
        />
      ))}
      <button
        type="button"
        onClick={onWO}
        disabled={disabled}
        title="Marcar W.O."
        className={cn(
          'rounded px-1 text-[10px] font-bold uppercase',
          woActive
            ? 'bg-amber-500 text-white'
            : 'text-neutral-600 hover:text-amber-500 disabled:opacity-30',
        )}
      >
        WO
      </button>
    </div>
  )
}
