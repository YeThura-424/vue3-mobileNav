import { afterEach, describe, expect, it } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import MobileNav from '../src/components/MobileNav.vue'

enableAutoUnmount(afterEach)
const icon = { body: '<path d="M4 4h16v16H4z"/>', width: 24, height: 24 }
const items = [
  { id: 'home', label: 'Home', icon },
  { id: 'search', label: 'Search', icon, disabled: true },
  { id: 'profile', label: 'Profile', icon, badge: 3 },
]

describe('MobileNav', () => {
  it('renders user labels and arbitrary item counts in array order', async () => {
    const wrapper = mount(MobileNav, { props: { items } })
    expect(wrapper.findAll('button').map((b) => b.attributes('aria-label'))).toEqual([
      'Home',
      'Search',
      'Profile, 3 notifications',
    ])
    await wrapper.setProps({
      items: Array.from({ length: 12 }, (_, i) => ({ id: String(i), label: `Item ${i}`, icon })),
    })
    expect(wrapper.findAll('button')).toHaveLength(12)
    await wrapper.setProps({ items: [] })
    expect(wrapper.findAll('button')).toHaveLength(0)
    expect(wrapper.find('ul').exists()).toBe(false)
    expect(wrapper.find('.mn-empty').text()).toBe('No navigation items')
  })

  it('emits the stable ID and item and updates uncontrolled selection', async () => {
    const wrapper = mount(MobileNav, { props: { items } })
    await wrapper.findAll('button')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['profile']])
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual(items[2])
    expect(wrapper.find('[aria-current="page"]').attributes('aria-label')).toBe(
      'Profile, 3 notifications',
    )
  })

  it('respects controlled selection until the parent updates it', async () => {
    const wrapper = mount(MobileNav, { props: { items, modelValue: 'home' } })
    await wrapper.findAll('button')[2]!.trigger('click')
    expect(wrapper.find('[aria-current="page"]').attributes('aria-label')).toBe('Home')
    await wrapper.setProps({ modelValue: 'profile' })
    expect(wrapper.find('[aria-current="page"]').attributes('aria-label')).toContain('Profile')
  })

  it('never selects disabled items and skips them during keyboard focus', async () => {
    const wrapper = mount(MobileNav, { props: { items }, attachTo: document.body })
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    await wrapper.findAll('button')[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement?.getAttribute('data-nav-id')).toBe('profile')
    await wrapper.findAll('button')[2]!.trigger('keydown', { key: 'Home' })
    expect(document.activeElement?.getAttribute('data-nav-id')).toBe('home')
  })

  it('keeps selection by ID on reorder and falls back after removal', async () => {
    const wrapper = mount(MobileNav, { props: { items } })
    await wrapper.findAll('button')[2]!.trigger('click')
    await wrapper.setProps({ items: [items[2]!, items[0]!] })
    expect(wrapper.find('[aria-current="page"]').attributes('data-nav-id')).toBe('profile')
    await wrapper.setProps({ items: [items[0]!] })
    expect(wrapper.find('[aria-current="page"]').attributes('data-nav-id')).toBe('home')
  })

  it('does not invent a selection for an invalid controlled ID or all-disabled list', () => {
    const controlled = mount(MobileNav, { props: { items, modelValue: 'missing' } })
    expect(controlled.find('[aria-current]').exists()).toBe(false)
    const disabled = mount(MobileNav, {
      props: { items: items.map((item) => ({ ...item, disabled: true })) },
    })
    expect(disabled.find('[aria-current]').exists()).toBe(false)
  })

  it('moves the featured treatment with the configured item', async () => {
    const wrapper = mount(MobileNav, {
      props: { items, variant: 'cradle', featuredId: 'profile', theme: 'dark' },
    })
    expect(wrapper.find('.mn-featured').attributes('data-nav-id')).toBe('profile')
    await wrapper.setProps({ featuredId: 'home' })
    expect(wrapper.find('.mn-featured').attributes('data-nav-id')).toBe('home')
    expect(wrapper.attributes('data-theme')).toBe('dark')
  })
})
