import type { GroupStanding } from '../../types'
import { cn } from '../../lib/cn'

interface GroupTableProps {
  standings: GroupStanding[]
  names: Map<string, string>
  qualifiersPerGroup: number
}

export function GroupTable({ standings, names, qualifiersPerGroup }: GroupTableProps) {
  return (
    <table className="mb-4 w-full text-sm">
      <thead>
        <tr className="text-left text-neutral-500">
          <th className="py-1">#</th>
          <th className="py-1">Equipe</th>
          <th className="w-8 py-1 text-center">J</th>
          <th className="w-8 py-1 text-center">V</th>
          <th className="w-8 py-1 text-center">E</th>
          <th className="w-8 py-1 text-center">D</th>
          <th className="w-8 py-1 text-center">SG</th>
          <th className="w-8 py-1 text-center">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((s, i) => (
          <tr
            key={s.teamId}
            className={cn(
              'border-t border-neutral-800',
              i < qualifiersPerGroup && 'bg-emerald-950/30',
            )}
          >
            <td className="py-1">{i + 1}</td>
            <td className="py-1 font-medium">{names.get(s.teamId)}</td>
            <td className="text-center">{s.played}</td>
            <td className="text-center">{s.wins}</td>
            <td className="text-center">{s.draws}</td>
            <td className="text-center">{s.losses}</td>
            <td className="text-center">{s.goalDiff}</td>
            <td className="text-center font-semibold">{s.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
