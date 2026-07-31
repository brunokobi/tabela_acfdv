import { useState, type ComponentType } from 'react'
import { cn } from '../../lib/cn'

interface LogoProps {
  src: string
  alt: string
  fallbackIcon: ComponentType<{ className?: string }>
  className?: string
}

/** Tries the given image path first (e.g. public/logos/ps5.png); falls back to a generic icon if it's missing. */
export function Logo({ src, alt, fallbackIcon: Icon, className }: LogoProps) {
  const [failed, setFailed] = useState(false)

  const matrixBorder =
    'rounded-md border border-green-500/70 shadow-[0_0_8px_rgba(34,197,94,0.45)]'

  if (failed) {
    return (
      <span className={cn(matrixBorder, 'inline-flex items-center justify-center', className)}>
        <Icon className="h-full w-full" />
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(matrixBorder, 'object-contain', className)}
      onError={() => setFailed(true)}
    />
  )
}
