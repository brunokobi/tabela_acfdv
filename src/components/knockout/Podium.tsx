import { Trophy, Medal } from 'lucide-react'
import { cn } from '../../lib/cn'

interface PodiumProps {
  champion: string
  runnerUp?: string | null
  thirdPlace?: string | null
}

const PLACE_CONFIG = {
  1: {
    label: 'Campeão',
    border: 'border-yellow-400/70',
    bg: 'from-yellow-950/30 to-black/60',
    glow: 'shadow-[0_0_30px_-5px_rgba(250,204,21,0.45)]',
    color: 'text-yellow-400',
    icon: Trophy,
    iconSize: 'h-14 w-14',
    nameSize: 'text-3xl',
    pad: 'px-8 py-7',
  },
  2: {
    label: 'Vice-campeão',
    border: 'border-slate-300/60',
    bg: 'from-slate-700/30 to-black/60',
    glow: 'shadow-[0_0_20px_-6px_rgba(203,213,225,0.35)]',
    color: 'text-slate-300',
    icon: Medal,
    iconSize: 'h-10 w-10',
    nameSize: 'text-xl',
    pad: 'px-6 py-5',
  },
  3: {
    label: '3º lugar',
    border: 'border-amber-700/60',
    bg: 'from-amber-950/30 to-black/60',
    glow: 'shadow-[0_0_20px_-6px_rgba(180,83,9,0.35)]',
    color: 'text-amber-600',
    icon: Medal,
    iconSize: 'h-10 w-10',
    nameSize: 'text-xl',
    pad: 'px-6 py-5',
  },
} as const

function PodiumCard({ place, name }: { place: 1 | 2 | 3; name: string }) {
  const cfg = PLACE_CONFIG[place]
  const Icon = cfg.icon
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-2xl border-2 bg-gradient-to-b text-center',
        cfg.border,
        cfg.bg,
        cfg.glow,
        cfg.pad,
      )}
    >
      <Icon className={cn(cfg.iconSize, cfg.color)} />
      <p className={cn('text-xs font-semibold tracking-widest uppercase', cfg.color)}>{cfg.label}</p>
      <p className={cn('font-extrabold text-white', cfg.nameSize)}>{name}</p>
    </div>
  )
}

/** Podium com os 3 primeiros colocados — ouro (campeão), prata (vice), bronze (3º lugar). */
export function Podium({ champion, runnerUp, thirdPlace }: PodiumProps) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      {runnerUp && <PodiumCard place={2} name={runnerUp} />}
      <PodiumCard place={1} name={champion} />
      {thirdPlace && <PodiumCard place={3} name={thirdPlace} />}
    </div>
  )
}
