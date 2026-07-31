import { ChevronUp, ChevronDown } from 'lucide-react'
import { useTournamentStore } from '../../store/tournamentStore'

export function TiebreakerEditor() {
  const tiebreakers = useTournamentStore((s) => s.config.tiebreakers)
  const setTiebreakers = useTournamentStore((s) => s.setTiebreakers)

  function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= tiebreakers.length) return
    const next = tiebreakers.slice()
    ;[next[index], next[target]] = [next[target], next[index]]
    setTiebreakers(next)
  }

  return (
    <div>
      <ol className="space-y-1">
        {tiebreakers.map((tb, i) => (
          <li
            key={tb.id}
            className="flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-1.5 text-sm"
          >
            <span className="w-5 text-neutral-400">{i + 1}º</span>
            <span className="flex-1">{tb.label}</span>
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="text-neutral-400 hover:text-neutral-200 disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === tiebreakers.length - 1}
              className="text-neutral-400 hover:text-neutral-200 disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
