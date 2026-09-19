import { addIcon } from '@iconify/vue'
import home from '@iconify-icons/solar/home-2-linear'
import homeBold from '@iconify-icons/solar/home-2-bold'
import search from '@iconify-icons/solar/magnifer-linear'
import searchBold from '@iconify-icons/solar/magnifer-bold'
import shop from '@iconify-icons/solar/shop-linear'
import shopBold from '@iconify-icons/solar/shop-bold'
import cart from '@iconify-icons/solar/cart-large-minimalistic-linear'
import cartBold from '@iconify-icons/solar/cart-large-minimalistic-bold'
import user from '@iconify-icons/solar/user-rounded-linear'
import userBold from '@iconify-icons/solar/user-rounded-bold'
import grid from '@iconify-icons/solar/widget-2-linear'
import code from '@iconify-icons/solar/code-square-linear'
import copy from '@iconify-icons/solar/copy-linear'
import arrow from '@iconify-icons/solar/arrow-right-linear'
import up from '@iconify-icons/solar/arrow-up-linear'
import down from '@iconify-icons/solar/arrow-down-linear'
import close from '@iconify-icons/solar/close-circle-linear'
import moon from '@iconify-icons/solar/moon-linear'
import sun from '@iconify-icons/solar/sun-2-linear'
import plus from '@iconify-icons/solar/add-circle-linear'
import settings from '@iconify-icons/solar/settings-linear'
import book from '@iconify-icons/solar/book-2-linear'
import palette from '@iconify-icons/solar/palette-linear'
import check from '@iconify-icons/solar/check-circle-linear'
import menu from '@iconify-icons/solar/hamburger-menu-linear'
import reset from '@iconify-icons/solar/restart-linear'
import external from '@iconify-icons/solar/square-arrow-right-up-linear'
import layers from '@iconify-icons/solar/layers-minimalistic-linear'
import shield from '@iconify-icons/solar/shield-check-linear'
import type { NavItem } from '../components'

export const icons = {
  home,
  search,
  shop,
  cart,
  user,
  grid,
  code,
  copy,
  arrow,
  up,
  down,
  close,
  moon,
  sun,
  plus,
  settings,
  book,
  palette,
  check,
  menu,
  reset,
  external,
  layers,
  shield,
}
const bundled = {
  'home-2-linear': home,
  'home-2-bold': homeBold,
  'magnifer-linear': search,
  'magnifer-bold': searchBold,
  'shop-linear': shop,
  'shop-bold': shopBold,
  'cart-large-minimalistic-linear': cart,
  'cart-large-minimalistic-bold': cartBold,
  'user-rounded-linear': user,
  'user-rounded-bold': userBold,
  'settings-linear': settings,
}
for (const [name, data] of Object.entries(bundled)) addIcon(`solar:${name}`, data)

export const defaultItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'solar:home-2-linear', activeIcon: 'solar:home-2-bold' },
  {
    id: 'search',
    label: 'Search',
    icon: 'solar:magnifer-linear',
    activeIcon: 'solar:magnifer-bold',
  },
  { id: 'shop', label: 'Shop', icon: 'solar:shop-linear', activeIcon: 'solar:shop-bold' },
  {
    id: 'cart',
    label: 'Cart',
    icon: 'solar:cart-large-minimalistic-linear',
    activeIcon: 'solar:cart-large-minimalistic-bold',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'solar:user-rounded-linear',
    activeIcon: 'solar:user-rounded-bold',
  },
]
export function freshItems() {
  return defaultItems.map((item) => ({ ...item, to: item.id === 'home' ? '/' : `/${item.id}` }))
}
