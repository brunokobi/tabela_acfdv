import { useEffect, useRef, useState } from 'react'
import { Trophy } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ChampionCelebrationProps {
  championName: string
  onFinish: () => void
}

interface ConfettiPiece {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
}

const COLORS = ['#22c55e', '#4ade80', '#facc15', '#ffffff', '#16a34a']

function createPieces(width: number, count = 160): ConfettiPiece[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: -20 - Math.random() * 400,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 3,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 6,
  }))
}

/** One-shot confetti burst, then a reveal of the champion's name. Closes only via the button. */
export function ChampionCelebration({ championName, onFinish }: ChampionCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let pieces = createPieces(canvas.width)
    let raf = 0

    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (const p of pieces) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.03
        p.rotation += p.rotationSpeed
        ctx!.save()
        ctx!.translate(p.x, p.y)
        ctx!.rotate((p.rotation * Math.PI) / 180)
        ctx!.fillStyle = p.color
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx!.restore()
      }
      pieces = pieces.filter((p) => p.y < canvas!.height + 40)
      if (pieces.length > 0) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const titleTimer = setTimeout(() => setShowTitle(true), 500)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(titleTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

      <div
        className={cn(
          'flex flex-col items-center gap-4 transition-all duration-700',
          showTitle ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
        )}
      >
        <Trophy className="h-24 w-24 text-yellow-400 drop-shadow-[0_0_24px_rgba(250,204,21,0.6)]" />
        <p className="text-sm font-semibold tracking-widest text-green-400 uppercase">Campeão</p>
        <p className="max-w-2xl text-center text-5xl font-extrabold text-white drop-shadow-[0_0_16px_rgba(34,197,94,0.6)]">
          {championName}
        </p>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="absolute bottom-10 rounded-md border border-white/30 px-4 py-2 text-sm text-white hover:bg-white/10"
      >
        Fechar
      </button>
    </div>
  )
}
