import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount, flushPromises } from '@vue/test-utils'
import MobileNav from '../src/components/MobileNav.vue'

enableAutoUnmount(afterEach)
const icon = { body: '<path d="M4 4h16v16H4z"/>', width: 24, height: 24 }
const items = [
  { id: 'home', label: 'Home', icon, to: '/' },
  {
    id: 'profile',
    label: 'Profile',
    icon,
    activeIcon: { ...icon, body: '<circle cx="12" cy="12" r="8"/>' },
    to: '/profile',
  },
]

// Inspect cancellation after the component handler, then stop jsdom's unsupported page load.
function nativeClick(element: Element, event: MouseEvent) {
  let prevented = false
  element.addEventListener(
    'click',
    () => {
      prevented = event.defaultPrevented
      event.preventDefault()
    },
    { once: true },
  )
  element.dispatchEvent(event)
  return prevented
}

describe('destinations and state', () => {
  it('renders genuine links for destinations and buttons for actions', () => {
    const wrapper = mount(MobileNav, {
      props: { items: [...items, { id: 'add', label: 'Add', icon }] },
    })
    expect(wrapper.get('[data-nav-id="profile"]').element.tagName).toBe('A')
    expect(wrapper.get('[data-nav-id="profile"]').attributes('href')).toBe('/profile')
    expect(wrapper.get('[data-nav-id="add"]').element.tagName).toBe('BUTTON')
  })

  it('uses the provided navigation handler and emits the clicked item', async () => {
    const navigate = vi.fn()
    const wrapper = mount(MobileNav, { props: { items, navigate } })
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    wrapper.get('[data-nav-id="profile"]').element.dispatchEvent(event)
    expect(navigate).toHaveBeenCalledWith('/profile')
    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('select')).toEqual([[items[1], event]])
  })

  it('lets a native link navigate when no handler is provided', () => {
    const wrapper = mount(MobileNav, { props: { items } })
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    expect(nativeClick(wrapper.get('[data-nav-id="profile"]').element, event)).toBe(false)
  })

  it.each(['ctrlKey', 'metaKey', 'shiftKey', 'altKey'])(
    'preserves %s native link behavior',
    (key) => {
      const navigate = vi.fn()
      const wrapper = mount(MobileNav, { props: { items, navigate } })
      const event = new MouseEvent('click', { [key]: true, bubbles: true, cancelable: true })
      const prevented = nativeClick(wrapper.get('[data-nav-id="profile"]').element, event)
      expect(navigate).not.toHaveBeenCalled()
      expect(wrapper.emitted('select')).toBeUndefined()
      expect(prevented).toBe(false)
    },
  )

  it('does not route external or new-tab links through the SPA handler', () => {
    const navigate = vi.fn()
    const wrapper = mount(MobileNav, {
      props: {
        navigate,
        items: [
          { ...items[0]!, to: 'https://example.com' },
          { ...items[1]!, target: '_blank' },
        ],
      },
    })
    for (const link of wrapper.findAll('a')) {
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      expect(nativeClick(link.element, event)).toBe(false)
    }
    expect(navigate).not.toHaveBeenCalled()
    expect(wrapper.get('[target="_blank"]').attributes('rel')).toBe('noopener noreferrer')
  })

  it('synchronizes active/default states from the current path, including browser history changes', async () => {
    const wrapper = mount(MobileNav, { props: { items, activePath: '/profile' } })
    expect(wrapper.get('[aria-current="page"]').attributes('data-nav-id')).toBe('profile')
    expect(wrapper.get('[data-nav-id="home"]').attributes('data-state')).toBe('default')
    await wrapper.setProps({ activePath: '/' })
    expect(wrapper.get('[aria-current="page"]').attributes('data-nav-id')).toBe('home')
    await wrapper.setProps({ activePath: '/missing' })
    expect(wrapper.find('[aria-current]').exists()).toBe(false)
  })

  it('supports a default active ID, with modelValue taking precedence over activePath', () => {
    const wrapper = mount(MobileNav, { props: { items, defaultActive: 'profile' } })
    expect(wrapper.get('[aria-current="page"]').attributes('data-nav-id')).toBe('profile')
    const controlled = mount(MobileNav, {
      props: { items, modelValue: 'home', activePath: '/profile' },
    })
    expect(controlled.get('[aria-current="page"]').attributes('data-nav-id')).toBe('home')
  })

  it('prevents disabled destinations and traverses mixed links and buttons with the keyboard', async () => {
    const navigate = vi.fn()
    const wrapper = mount(MobileNav, {
      props: {
        navigate,
        items: [
          items[0]!,
          { ...items[1]!, disabled: true },
          { id: 'action', label: 'Action', icon },
        ],
      },
      attachTo: document.body,
    })
    expect(wrapper.get('[data-nav-id="profile"]').attributes('href')).toBeUndefined()
    await wrapper.get('[data-nav-id="profile"]').trigger('click')
    expect(navigate).not.toHaveBeenCalled()
    await wrapper.get('[data-nav-id="home"]').trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement?.getAttribute('data-nav-id')).toBe('action')
  })

  it('allows select handlers to cancel navigation', () => {
    const navigate = vi.fn()
    const wrapper = mount(MobileNav, {
      props: {
        items,
        navigate,
        onSelect: (_item: unknown, event: MouseEvent) => event.preventDefault(),
      },
    })
    wrapper
      .get('[data-nav-id="profile"]')
      .element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(navigate).not.toHaveBeenCalled()
  })

  it.each(['javascript:alert(1)', 'data:text/html,hello', 'java\nscript:alert(1)'])(
    'does not create executable destination %s',
    (to) => {
      const wrapper = mount(MobileNav, { props: { items: [{ ...items[0]!, to }] } })
      expect(wrapper.find('a').exists()).toBe(false)
    },
  )

  it('reports a rejected navigation handler without losing route-owned selection', async () => {
    const error = new Error('Navigation failed')
    const wrapper = mount(MobileNav, {
      props: { items, activePath: '/', navigate: () => Promise.reject(error) },
    })
    await wrapper.get('[data-nav-id="profile"]').trigger('click')
    await flushPromises()
    expect(wrapper.emitted('navigation-error')).toEqual([[error, items[1]]])
    expect(wrapper.get('[aria-current="page"]').attributes('data-nav-id')).toBe('home')
  })
})
