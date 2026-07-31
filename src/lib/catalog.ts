import { Gamepad2, Joystick, CircleDot, Trophy } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Game, Platform } from '../types'

export interface CatalogEntry<T extends string> {
  id: T
  label: string
  logoSrc: string
  fallbackIcon: ComponentType<{ className?: string }>
}

export const PLATFORMS: CatalogEntry<Platform>[] = [
  { id: 'ps4', label: 'PS4', logoSrc: '/logos/ps4.jpg', fallbackIcon: Joystick },
  { id: 'ps5', label: 'PS5', logoSrc: '/logos/ps5.webp', fallbackIcon: Gamepad2 },
]

export const GAMES: CatalogEntry<Game>[] = [
  { id: 'ec26', label: 'EA Sports FC 26', logoSrc: '/logos/ec26.png', fallbackIcon: Trophy },
  { id: 'efootball', label: 'eFootball', logoSrc: '/logos/efootball.png', fallbackIcon: CircleDot },
]
