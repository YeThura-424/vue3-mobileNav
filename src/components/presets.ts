import type { NavVariant } from './types'

export const navPresets: readonly {
  id: NavVariant
  name: string
  description: string
  featured: boolean
}[] = [
  {
    id: 'orbit',
    name: 'Orbit',
    description: 'A raised action with a soft outer ring.',
    featured: true,
  },
  {
    id: 'cradle',
    name: 'Cradle',
    description: 'A floating action nestled in a curved cutout.',
    featured: true,
  },
  {
    id: 'underline',
    name: 'Underline',
    description: 'A fine top indicator. Quiet and familiar.',
    featured: false,
  },
  {
    id: 'outline',
    name: 'Outline',
    description: 'An icon-only capsule with an outlined action.',
    featured: true,
  },
  {
    id: 'pill',
    name: 'Pill',
    description: 'An expanding capsule follows your selection.',
    featured: false,
  },
  {
    id: 'float',
    name: 'Float',
    description: 'The selected icon lifts above a curved surface.',
    featured: true,
  },
  {
    id: 'peak',
    name: 'Peak',
    description: 'A sloping silhouette meets a central action.',
    featured: true,
  },
  {
    id: 'soft-rise',
    name: 'Soft rise',
    description: 'A compact raised action with a gentle shadow.',
    featured: true,
  },
]
