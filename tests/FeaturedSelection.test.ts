import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { MobileNav } from '../src/components'
import type { NavVariant } from '../src/components'

enableAutoUnmount(afterEach)
const icon = { body: '<path d="M4 4h16v16H4z"/>', width: 24, height: 24 }
const items = ['home', 'search', 'shop', 'cart', 'profile'].map(id => ({ id, label: id, icon }))
const circleStyles: NavVariant[] = ['orbit', 'cradle', 'outline', 'float', 'peak', 'soft-rise']

describe('moving featured selection', () => {
  it.each(circleStyles)('%s selects the middle item by default and moves its circle on activation', async variant => {
    const wrapper = mount(MobileNav, { props: { items, variant } })
    expect(wrapper.get('[aria-current="page"]').attributes('data-nav-id')).toBe('shop')
    expect(wrapper.get('.mn-featured').attributes('data-nav-id')).toBe('shop')
    expect(wrapper.get('.mn-track').attributes('style')).toContain('--mn-feature-x: 50%')
    await wrapper.get('[data-nav-id="profile"]').trigger('click')
    expect(wrapper.get('.mn-featured').attributes('data-nav-id')).toBe('profile')
    expect(wrapper.findAll('.mn-featured')).toHaveLength(1)
    expect(wrapper.get('.mn-track').attributes('style')).toContain('--mn-feature-x: 90%')
    await wrapper.get('[data-nav-id="home"]').trigger('click')
    expect(wrapper.get('.mn-track').attributes('style')).toContain('--mn-feature-x: 10%')
  })

  it('uses a supplied featured item as the initial selection, but follows later clicks', async () => {
    const wrapper = mount(MobileNav, { props: { items, variant: 'cradle', featuredId: 'profile' } })
    expect(wrapper.get('[aria-current="page"]').attributes('data-nav-id')).toBe('profile')
    await wrapper.get('[data-nav-id="home"]').trigger('click')
    expect(wrapper.get('.mn-featured').attributes('data-nav-id')).toBe('home')
    await wrapper.setProps({ featuredId: 'cart' })
    expect(wrapper.get('[aria-current="page"]').attributes('data-nav-id')).toBe('cart')
    expect(wrapper.get('.mn-featured').attributes('data-nav-id')).toBe('cart')
  })

  it('keeps controlled selection authoritative and moves the shape after parent changes', async () => {
    const wrapper = mount(MobileNav, { props: { items, variant: 'orbit', modelValue: 'home', featuredId: 'shop' } })
    expect(wrapper.get('.mn-featured').attributes('data-nav-id')).toBe('home')
    await wrapper.setProps({ modelValue: 'profile' })
    expect(wrapper.get('.mn-featured').attributes('data-nav-id')).toBe('profile')
    await wrapper.setProps({ modelValue: 'missing' })
    expect(wrapper.find('.mn-featured').exists()).toBe(false)
    expect(wrapper.find('.mn-feature-marker').exists()).toBe(false)
  })

  it('honors defaultActive before the middle default and handles disabled centers and even counts', () => {
    const explicit = mount(MobileNav, { props: { items, variant: 'float', defaultActive: 'home' } })
    expect(explicit.get('.mn-featured').attributes('data-nav-id')).toBe('home')
    const disabledCenter = mount(MobileNav, { props: { items: items.map(item => ({ ...item, disabled: item.id === 'shop' })), variant: 'peak' } })
    expect(disabledCenter.get('.mn-featured').attributes('data-nav-id')).toBe('search')
    const even = mount(MobileNav, { props: { items: items.slice(0, 4), variant: 'outline' } })
    expect(even.get('.mn-featured').attributes('data-nav-id')).toBe('search')
  })

  it('keeps the selected circle aligned after item reorder and clears all-disabled lists', async () => {
    const wrapper = mount(MobileNav, { props: { items, variant: 'soft-rise' } })
    await wrapper.setProps({ items: [items[2]!, items[0]!, items[1]!, items[3]!, items[4]!] })
    expect(wrapper.get('.mn-featured').attributes('data-nav-id')).toBe('shop')
    expect(wrapper.get('.mn-track').attributes('style')).toContain('--mn-feature-x: 10%')
    await wrapper.setProps({ items: items.map(item => ({ ...item, disabled: true })) })
    expect(wrapper.find('[aria-current]').exists()).toBe(false)
    expect(wrapper.find('.mn-feature-marker').exists()).toBe(false)
  })
})
