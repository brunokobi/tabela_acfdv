import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface PanelProps {
  className?: string
  children: ReactNode
}

/** Glass card with a fixed 10%-of-page side margin, regardless of content. */
export function Panel({ className, children }: PanelProps) {
  return (
    <div
      className={cn(
        'mx-[10%] space-y-8 rounded-2xl border border-green-500/20 bg-black/70 p-6 shadow-xl backdrop-blur-md sm:p-8',
        className,
      )}
    >
      {children}
    </div>
  )
}
