import type { ComponentType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface CardProps {
  icon: ComponentType<{ className?: string }>
  title: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function Card({ icon: Icon, title, action, className, children }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-neutral-800 bg-neutral-950/70 p-4', className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-green-500/15 text-green-400">
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
