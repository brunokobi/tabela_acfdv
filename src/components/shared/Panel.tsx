import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface PanelProps {
  maxWidth?: string
  className?: string
  children: ReactNode
}

/** Content-hugging glass card: grows only as wide/tall as its content needs. */
export function Panel({ maxWidth = 'max-w-3xl', className, children }: PanelProps) {
  return (
    <div
      className={cn(
        'mx-auto space-y-8 rounded-2xl border border-green-500/20 bg-black/70 p-6 shadow-xl backdrop-blur-md sm:p-8',
        maxWidth,
        className,
      )}
    >
      {children}
    </div>
  )
}
