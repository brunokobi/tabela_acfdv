import { useEffect, useRef } from 'react'
import { Gamepad2, Trophy, CircleDot, Joystick } from 'lucide-react'

const ICONS = [Gamepad2, Trophy, CircleDot, Joystick]

// Deterministic layout (no Math.random) so it stays stable across re-renders/HMR.
const FLOATERS = Array.from({ length: 10 }, (_, i) => ({
  Icon: ICONS[i % ICONS.length],
  top: `${(i * 37) % 90}%`,
  left: `${(i * 53) % 95}%`,
  size: 24 + (i % 4) * 10,
  duration: 14 + (i % 5) * 4,
  delay: -(i * 2.3),
}))

/**
 * Fixed decorative layer: mouse-reactive glow orbs (parallax depth) + a faint
 * scanline texture + slow-drifting theme icons. Sits behind all content, which
 * scrolls over it — the classic fixed-background parallax effect.
 */
export function ParallaxBackground() {
  const orbsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      const orbs = orbsRef.current?.querySelectorAll<HTMLElement>('[data-depth]')
      orbs?.forEach((el) => {
        const depth = Number(el.dataset.depth)
        el.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-neutral-50 dark:bg-neutral-950" aria-hidden>
      <div ref={orbsRef} className="absolute inset-0">
        <div
          data-depth="18"
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl transition-transform duration-300 ease-out dark:bg-indigo-500/20"
        />
        <div
          data-depth="28"
          className="absolute top-1/4 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-400/15 blur-3xl transition-transform duration-300 ease-out dark:bg-emerald-500/15"
        />
        <div
          data-depth="12"
          className="absolute bottom-[-10%] left-1/3 h-96 w-96 rounded-full bg-fuchsia-400/10 blur-3xl transition-transform duration-300 ease-out dark:bg-fuchsia-500/15"
        />
      </div>

      <div
        className="absolute inset-0 text-indigo-500 opacity-[0.05] dark:opacity-[0.08]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, currentColor 3px, currentColor 4px)',
        }}
      />

      {FLOATERS.map(({ Icon, top, left, size, duration, delay }, i) => (
        <Icon
          key={i}
          className="animate-float absolute text-indigo-500/10 dark:text-indigo-400/10"
          style={{
            top,
            left,
            width: size,
            height: size,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  )
}
