import { Trophy } from 'lucide-react'

interface ChampionBannerProps {
  championName: string
}

export function ChampionBanner({ championName }: ChampionBannerProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-b from-green-950/40 to-black/60 px-8 py-6 text-center shadow-[0_0_30px_-5px_rgba(250,204,21,0.35)]">
      <Trophy className="h-12 w-12 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]" />
      <p className="text-xs font-semibold tracking-widest text-green-400 uppercase">Campeão</p>
      <p className="text-3xl font-extrabold text-white">{championName}</p>
    </div>
  )
}
