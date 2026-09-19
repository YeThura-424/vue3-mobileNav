import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { MobileNav, navPresets } from 'vue3-mobile-nav'

assert.ok(MobileNav)
const require = createRequire(import.meta.url)
assert.ok(require('vue3-mobile-nav').MobileNav, 'CommonJS entry must load')
assert.ok(existsSync(require.resolve('vue3-mobile-nav/style.css')), 'CSS export must resolve')
const items = [
  { id: 'home', label: 'Home', icon: { body: '<path d="M4 4h16v16H4z"/>', width: 24, height: 24 } },
]
for (const preset of navPresets) {
  const html = await renderToString(
    createSSRApp({ render: () => h(MobileNav, { items, variant: preset.id }) }),
  )
  assert.match(html, /aria-label="Home"/)
  assert.match(html, /aria-current="page"/)
}
console.log('Package smoke checks passed: ESM, CommonJS, CSS export, and SSR for all 8 presets.')
