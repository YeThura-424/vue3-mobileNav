import type { IconifyIcon } from '@iconify/vue'

export interface NavItem {
  /** Unique and stable; selection follows this ID when items are reordered. */
  id: string
  label: string
  icon: string | IconifyIcon
  activeIcon?: string | IconifyIcon
  /** Link destination; relative links can be handled by the navigate prop. */
  to?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  disabled?: boolean
  badge?: string | number
}

export type NavVariant =
  | 'orbit'
  | 'cradle'
  | 'underline'
  | 'outline'
  | 'pill'
  | 'float'
  | 'peak'
  | 'soft-rise'
export type NavTheme = 'light' | 'dark'
