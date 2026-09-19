import { afterEach, describe, expect, it } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { MobileNav, navPresets } from '../src/components'
import Playground from '../src/docs/Playground.vue'
import { defaultItems } from '../src/docs/icons'

enableAutoUnmount(afterEach)

describe('navigation integration', () => {
  it('previews external destinations without exposing live links or changing the exported destination', async () => {
    const wrapper = mount(Playground, { props: { variant: 'pill' } })
    await wrapper.get('#destination-profile').setValue('https://example.com/profile')
    const profile = wrapper.get('[data-nav-id="profile"]')
    expect(profile.element.tagName).toBe('BUTTON')
    await profile.trigger('click')
    expect(wrapper.get('[aria-current="page"]').attributes('data-nav-id')).toBe('profile')
    expect(wrapper.get('[role="status"]').text()).toContain('https://example.com/profile')
    expect(wrapper.find('pre').text()).toContain('https://example.com/profile')
  })

  it.each(navPresets)('selects items in the $id preset in both themes', async (preset) => {
    const wrapper = mount(MobileNav, {
      props: { items: defaultItems, variant: preset.id, featuredId: 'shop' },
    })
    await wrapper.find('[data-nav-id="cart"]').trigger('click')
    expect(wrapper.find('[aria-current="page"]').attributes('data-nav-id')).toBe('cart')
    await wrapper.setProps({ theme: 'dark' })
    await wrapper.find('[data-nav-id="shop"]').trigger('click')
    expect(wrapper.find('[aria-current="page"]').attributes('data-nav-id')).toBe('shop')
  })

  it('updates the live preview and export when editing, reordering, adding and removing', async () => {
    const wrapper = mount(Playground, { props: { variant: 'cradle' } })
    await wrapper.find('#label-home').setValue('Dashboard')
    expect(wrapper.find('[data-nav-id="home"]').attributes('aria-label')).toBe('Dashboard')
    await wrapper.find('[aria-label="Move Dashboard down"]').trigger('click')
    expect(
      wrapper
        .findAll('[data-nav-id]')
        .map((button) => button.attributes('data-nav-id'))
        .slice(0, 2),
    ).toEqual(['search', 'home'])
    const add = wrapper.findAll('button').find((button) => button.text() === 'Add item')!
    await add.trigger('click')
    expect(wrapper.findAll('[data-nav-id]')).toHaveLength(6)
    await wrapper.find('[aria-label="Remove New item"]').trigger('click')
    expect(wrapper.findAll('[data-nav-id]')).toHaveLength(5)
    expect(wrapper.find('pre').text()).toContain('Dashboard')
    await wrapper.find('[aria-label="Use dark theme"]').trigger('click')
    expect(wrapper.find('nav').attributes('data-theme')).toBe('dark')
    expect(wrapper.find('pre').text()).toContain('theme="dark"')
    await wrapper.get('#destination-profile').setValue('/account')
    await wrapper.get('#active-icon-profile').setValue('solar:home-2-bold')
    await wrapper.get('[data-nav-id="profile"]').trigger('click')
    expect(wrapper.get('[role="status"]').text()).toContain('/account')
    expect(wrapper.find('pre').text()).toContain('"to": "/account"')
    expect(wrapper.find('pre').text()).toContain(':navigate="router.push"')
    await wrapper.get('.export-mode select').setValue('native')
    expect(wrapper.find('pre').text()).not.toContain('vue-router')
  })

  it('ignores duplicate/empty IDs and responds to an item becoming disabled', async () => {
    const wrapper = mount(MobileNav, {
      props: {
        items: [
          defaultItems[0]!,
          { ...defaultItems[1]!, id: 'home' },
          { ...defaultItems[2]!, id: '' },
          defaultItems[4]!,
        ],
      },
    })
    expect(wrapper.findAll('button')).toHaveLength(2)
    await wrapper.setProps({ items: [{ ...defaultItems[0]!, disabled: true }, defaultItems[4]!] })
    expect(wrapper.find('[aria-current="page"]').attributes('data-nav-id')).toBe('profile')
  })
})
