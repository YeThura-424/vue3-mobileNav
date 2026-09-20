import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import App from '../src/App.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  delete document.documentElement.dataset.theme
})

describe('documentation theme', () => {
  it('switches the entire document and every navigation preview together', async () => {
    const wrapper = mount(App)
    await wrapper.get('[aria-label="Use dark theme"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    for (const nav of wrapper.findAll('.mn-root')) expect(nav.attributes('data-theme')).toBe('dark')
    await wrapper.get('[aria-label="Use light theme"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
    for (const nav of wrapper.findAll('.mn-root'))
      expect(nav.attributes('data-theme')).toBe('light')
  })

  it('uses the playground theme control for the whole site and resets items without resetting theme', async () => {
    const wrapper = mount(App)
    await wrapper.get('#playground [aria-label="Use dark theme"]').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    const reset = wrapper.findAll('#playground button').find((button) => button.text() === 'Reset')!
    await reset.trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(wrapper.get('#playground .mn-featured').attributes('data-nav-id')).toBe('shop')
  })

  it('provides copyable install commands for each package manager', async () => {
    const wrapper = mount(App)
    const picker = wrapper.get('.package-manager-picker')
    const installBlock = wrapper.get('#installation .code-block')

    expect(installBlock.text()).toContain('npm install vue3-mobile-nav')
    await picker.get('button:nth-child(2)').trigger('click')
    expect(installBlock.text()).toContain('pnpm add vue3-mobile-nav')
    await picker.get('button:nth-child(3)').trigger('click')
    expect(installBlock.text()).toContain('yarn add vue3-mobile-nav')
    await picker.get('button:nth-child(4)').trigger('click')
    expect(installBlock.text()).toContain('bun add vue3-mobile-nav')
  })
})
