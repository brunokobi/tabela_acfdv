import { useEffect, useState } from 'react'

export interface RevealItem {
  key: string
  label: string
  finalText: string
}

interface DrawRevealOverlayProps {
  title: string
  items: RevealItem[]
  pool: string[]
  onFinish: () => void
}

const SPIN_MS = 3000
const SPIN_TICK_MS = 90
const HOLD_MS = 500

export function DrawRevealOverlay({ title, items, pool, onFinish }: DrawRevealOverlayProps) {
  const [index, setIndex] = useState(0)
  const [spinningText, setSpinningText] = useState(pool[0] ?? '')
  const [revealed, setRevealed] = useState<string[]>([])

  useEffect(() => {
    if (index >= items.length) {
      onFinish()
      return
    }

    const tickTimer = setInterval(() => {
      setSpinningText(pool[Math.floor(Math.random() * pool.length)] ?? '')
    }, SPIN_TICK_MS)

    const settleTimer = setTimeout(() => {
      clearInterval(tickTimer)
      setSpinningText(items[index].finalText)
      setRevealed((r) => [...r, items[index].finalText])
    }, SPIN_MS)

    const advanceTimer = setTimeout(() => setIndex((i) => i + 1), SPIN_MS + HOLD_MS)

    return () => {
      clearInterval(tickTimer)
      clearTimeout(settleTimer)
      clearTimeout(advanceTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const current = items[index]
  if (!current) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 px-6 backdrop-blur-sm">
      <p className="mb-2 text-xs font-medium tracking-widest text-green-400 uppercase">{title}</p>
      <p className="mb-6 text-lg text-neutral-300">{current.label}</p>
      <p className="mb-10 max-w-full truncate text-4xl font-bold text-green-400">{spinningText}</p>

      {revealed.length > 0 && (
        <div className="mb-10 flex max-w-2xl flex-wrap justify-center gap-2">
          {revealed.map((r, i) => (
            <span key={i} className="rounded bg-white/10 px-2 py-1 text-sm text-neutral-300">
              {r}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onFinish}
        className="rounded-md border border-white/30 px-4 py-2 text-sm text-white hover:bg-white/10"
      >
        Pular animação
      </button>
    </div>
  )
}
