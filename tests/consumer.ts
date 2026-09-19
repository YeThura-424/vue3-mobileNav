import { MobileNav, navPresets } from 'vue3-mobile-nav'
import type { NavItem, NavVariant } from 'vue3-mobile-nav'

const items: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'solar:home-2-linear',
    activeIcon: 'solar:home-2-bold',
    to: '/',
    target: '_self',
  },
]
const props: InstanceType<typeof MobileNav>['$props'] = {
  items,
  variant: 'cradle',
  activePath: '/',
  navigate: (_destination: string) => Promise.resolve(),
}
const preset: NavVariant = navPresets[0]!.id
// @ts-expect-error Invalid presets must be rejected by the distributed declarations.
const invalid: NavVariant = 'not-a-preset'
// @ts-expect-error Item IDs are required in the public type.
const invalidItem: NavItem = { label: 'Missing ID', icon: 'solar:home-2-linear' }
void [props, preset, invalid, invalidItem]
