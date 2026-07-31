import { useLayoutEffect, useRef, useState } from 'react'
import type { LegsMode } from '../../types'
import type { ResolvedMatch } from '../../lib/bracket'
import { MatchCard, type MatchCardHandlers } from './MatchCard'

interface BracketViewProps extends MatchCardHandlers {
  roundsData: ResolvedMatch[][]
  thirdPlaceEntry: ResolvedMatch | null
  legsMode: LegsMode
}

interface Connector {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export function BracketView({ roundsData, thirdPlaceEntry, legsMode, ...handlers }: BracketViewProps) {
  const columnHeight = (roundsData[0]?.length ?? 1) * 150
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef(new Map<string, HTMLDivElement>())
  const [connectors, setConnectors] = useState<Connector[]>([])

  function registerRow(rowKey: string) {
    return (el: HTMLDivElement | null) => {
      if (el) rowRefs.current.set(rowKey, el)
      else rowRefs.current.delete(rowKey)
    }
  }

  useLayoutEffect(() => {
    function recompute() {
      const container = containerRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()
      const next: Connector[] = []

      for (let r = 1; r < roundsData.length; r++) {
        roundsData[r].forEach((match, i) => {
          const feederRound = roundsData[r - 1]
          const feeders: Array<[ResolvedMatch | undefined, 'home' | 'away']> = [
            [feederRound[i * 2], 'home'],
            [feederRound[i * 2 + 1], 'away'],
          ]
          for (const [feeder, targetSide] of feeders) {
            if (!feeder || feeder.winner == null) continue
            const sourceSide = feeder.winner === feeder.home ? 'home' : 'away'
            const sourceEl = rowRefs.current.get(`${feeder.key}:${sourceSide}`)
            const targetEl = rowRefs.current.get(`${match.key}:${targetSide}`)
            if (!sourceEl || !targetEl) continue
            const sourceRect = sourceEl.getBoundingClientRect()
            const targetRect = targetEl.getBoundingClientRect()
            next.push({
              key: `${feeder.key}->${match.key}`,
              x1: sourceRect.right - containerRect.left,
              y1: sourceRect.top + sourceRect.height / 2 - containerRect.top,
              x2: targetRect.left - containerRect.left,
              y2: targetRect.top + targetRect.height / 2 - containerRect.top,
            })
          }
        })
      }
      setConnectors(next)
    }

    recompute()
    const observer = new ResizeObserver(recompute)
    if (containerRef.current) observer.observe(containerRef.current)
    window.addEventListener('resize', recompute)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', recompute)
    }
  }, [roundsData])

  return (
    <div className="overflow-x-auto pb-4">
      <div ref={containerRef} className="relative flex gap-10">
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {connectors.map((c) => {
            const midX = (c.x1 + c.x2) / 2
            return (
              <path
                key={c.key}
                d={`M ${c.x1} ${c.y1} H ${midX} V ${c.y2} H ${c.x2}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth={2}
                className="drop-shadow-[0_0_4px_rgba(34,197,94,0.7)]"
              />
            )
          })}
        </svg>

        {roundsData.map((matches, r) => (
          <div key={r} style={{ minWidth: 256 }}>
            <h3 className="mb-3 text-center text-xs font-semibold uppercase text-neutral-400">
              {matches[0]?.phase}
            </h3>
            <div className="flex flex-col justify-around gap-4" style={{ height: columnHeight }}>
              {matches.map((m) => (
                <MatchCard
                  key={m.key}
                  match={m}
                  legsMode={legsMode}
                  homeRowRef={registerRow(`${m.key}:home`)}
                  awayRowRef={registerRow(`${m.key}:away`)}
                  {...handlers}
                />
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
