import { useEffect, useRef } from 'react'

const ICONS = ['⚽', '🏆', '🎮', '🕹', '👟', '🥅', '🏅']

const FONT_SIZE = 22
const COLUMN_SPACING = FONT_SIZE * 2.4
const FRAME_MS = 100
const DRAW_PROBABILITY = 0.55

/**
 * Matrix-style digital rain, canvas-driven (sports icons falling on black,
 * fading trail via a low-alpha redraw each frame) plus two mouse-reactive
 * glow blobs for parallax depth. Fixed behind all content, which scrolls
 * over it — the classic fixed-background parallax effect.
 */
export function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let columns = 0
    let drops: number[] = []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      columns = Math.floor(canvas!.width / COLUMN_SPACING)
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50))
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
      ctx!.font = `${FONT_SIZE}px sans-serif`

      for (let i = 0; i < columns; i++) {
        if (Math.random() < DRAW_PROBABILITY) {
          const icon = ICONS[Math.floor(Math.random() * ICONS.length)]
          ctx!.fillText(icon, i * COLUMN_SPACING, drops[i] * FONT_SIZE)
        }
        if (drops[i] * FONT_SIZE > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, FRAME_MS)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x * 22}px, ${y * 22}px, 0)`
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black" aria-hidden>
      <div ref={glowRef} className="absolute inset-0 transition-transform duration-300 ease-out">
        <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-green-500/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-green-400/10 blur-3xl" />
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-80"
        style={{ filter: 'grayscale(1) sepia(1) hue-rotate(70deg) saturate(6) brightness(0.9)' }}
      />
    </div>
  )
}
