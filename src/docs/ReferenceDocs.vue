<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { icons } from './icons'
import CodeBlock from './CodeBlock.vue'

const packageManagers = ['npm', 'pnpm', 'yarn', 'bun'] as const
type PackageManager = (typeof packageManagers)[number]
const packageManager = ref<PackageManager>('npm')
const installCommand = computed(() => {
  const commands = {
    npm: 'npm install vue3-mobile-nav',
    pnpm: 'pnpm add vue3-mobile-nav',
    yarn: 'yarn add vue3-mobile-nav',
    bun: 'bun add vue3-mobile-nav',
  }
  return commands[packageManager.value]
})

const quickStart =
  `<script setup lang="ts">
import { MobileNav } from 'vue3-mobile-nav'
import 'vue3-mobile-nav/style.css'

const items = [
  {
    id: 'home',
    label: 'Home',
    icon: 'solar:home-2-linear',
    activeIcon: 'solar:home-2-bold',
    to: '/',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'solar:user-rounded-linear',
    activeIcon: 'solar:user-rounded-bold',
    to: '/profile',
  },
]
<` +
  `/script>

<template>
  <MobileNav :items="items" variant="pill" />
</template>`

const routerExample =
  `<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { MobileNav } from 'vue3-mobile-nav'
import 'vue3-mobile-nav/style.css'

const route = useRoute()
const router = useRouter()
const items = [
  { id: 'home', label: 'Home', icon: 'solar:home-2-linear', to: '/' },
  { id: 'profile', label: 'Profile', icon: 'solar:user-rounded-linear', to: '/profile' },
]
<` +
  `/script>

<template>
  <MobileNav
    :items="items"
    :active-path="route.path"
    :navigate="router.push"
    variant="cradle"
    featured-id="profile"
  />
</template>`

const actionExample = `function handleSelect(item, event) {
  if (item.id === 'compose') {
    event.preventDefault()
    openComposeDialog()
  }
}

// Omit "to" for action-only buttons.
const compose = {
  id: 'compose',
  label: 'Compose',
  icon: 'solar:pen-new-square-linear',
}

// <MobileNav :items="items" @select="handleSelect" />`

const props = [
  ['items', 'readonly NavItem[]', 'required', 'Labels, icons and destinations in display order.'],
  ['variant', 'NavVariant', 'pill', 'One of eight descriptive style names.'],
  ['modelValue', 'string', 'uncontrolled', 'Active ID. Use v-model for application-owned state.'],
  [
    'defaultActive',
    'string',
    'variant-dependent',
    'Initial active ID; circle styles default to the middle enabled item.',
  ],
  ['activePath', 'string', 'none', 'Exact destination match; reactive route state.'],
  [
    'navigate',
    '(to: string) => unknown',
    'native links',
    'Handle relative destinations with your router.',
  ],
  [
    'featuredId',
    'string',
    'active item',
    'Sets uncontrolled selection; the circle always follows the active item. A model or route takes precedence.',
  ],
  ['theme', "'light' | 'dark'", 'light', 'Surface and foreground defaults.'],
  ['position', "'inline' | 'fixed'", 'inline', 'Flow layout or fixed at the viewport bottom.'],
  ['label', 'string', 'Main navigation', 'Accessible navigation landmark name.'],
]
const tokens = [
  ['#3D52A0', 'Primary'],
  ['#7091E6', 'Accent'],
  ['#8697C4', 'Secondary'],
  ['#ADBBDA', 'Soft blue'],
  ['#EDE8F5', 'Lavender'],
]
</script>

<template>
  <section id="installation" class="docs-section reference-section">
    <span class="eyebrow">UP AND RUNNING</span>
    <h2>Two imports. Your menu. Done.</h2>
    <p>Vue 3.5 or later. Plain JavaScript or TypeScript. No CSS framework required.</p>
    <div class="install-steps">
      <div class="step-number">01</div>
      <div>
        <h3>Install the package</h3>
        <div class="package-manager-picker" aria-label="Choose your package manager">
          <button
            v-for="manager in packageManagers"
            :key="manager"
            type="button"
            :class="{ selected: packageManager === manager }"
            :aria-pressed="packageManager === manager"
            @click="packageManager = manager"
          >
            {{ manager }}
          </button>
        </div>
        <CodeBlock :title="`Terminal · ${packageManager}`" :code="installCommand" />
        <p>
          The package is published as <code>vue3-mobile-nav</code>. To use this checkout before the
          first release, run <code>npm pack</code> here and install the generated
          <code>vue3-mobile-nav-0.1.0.tgz</code> in your app.
        </p>
      </div>
    </div>
    <div class="install-steps">
      <div class="step-number">02</div>
      <div>
        <h3>Choose your destinations and style</h3>
        <p>
          <code>icon</code> is the default state. <code>activeIcon</code> is the selected state.
          <code>to</code> tells each item where to go. Omit it for an action button.
        </p>
        <CodeBlock :code="quickStart" title="App.vue · native links" />
      </div>
    </div>
    <aside class="callout">
      <Icon :icon="icons.book" />
      <p>
        <strong>Any Iconify pack.</strong> Names load on demand. For offline use or server
        rendering, pass imported icon data.
        <a href="https://iconify.design/docs/icon-components/vue/" target="_blank" rel="noreferrer"
          >Iconify Vue documentation</a
        >
      </p>
    </aside>
  </section>

  <section id="navigation" class="docs-section reference-section">
    <span class="eyebrow">YOUR APP. YOUR DESTINATIONS.</span>
    <h2>From Profile to /profile.</h2>
    <p>
      With Vue Router, pass its push function and the current path. There is no ID-to-route mapping
      to maintain, and back/forward navigation stays synchronized.
    </p>
    <CodeBlock :code="routerExample" title="AppNavigation.vue · Vue Router" />
    <p>
      <code>activePath</code> matches item destinations exactly. For nested routes, named routes, or
      custom matching, use <code>v-model</code> or <code>:model-value</code> with your own selected
      ID. A supplied model value takes precedence over path matching.
    </p>
    <div class="reference-columns">
      <div>
        <h3>Links behave like links</h3>
        <p>
          Ctrl/Cmd-click, middle-click, and <code>target: '_blank'</code> use native browser
          behavior. External HTTP(S), mail, and phone links bypass the SPA handler. Items without a
          destination are native buttons.
        </p>
      </div>
      <div>
        <h3>Actions stay in your control</h3>
        <p>
          <code>select(item, event)</code> fires before selection or navigation. Call
          <code>event.preventDefault()</code> to cancel both. Thrown or rejected navigation handlers
          emit <code>navigation-error(error, item)</code>.
        </p>
      </div>
    </div>
    <CodeBlock :code="actionExample" title="Custom actions" />
  </section>

  <section id="api" class="docs-section reference-section">
    <span class="eyebrow">THE DETAILS</span>
    <h2>A small API. Plenty of control.</h2>
    <h3 class="subheading">Component props</h3>
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in props" :key="row[0]">
            <td>
              <code>{{ row[0] }}</code>
            </td>
            <td>
              <code>{{ row[1] }}</code>
            </td>
            <td>{{ row[2] }}</td>
            <td>{{ row[3] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 class="subheading">Menu item</h3>
    <CodeBlock
      title="TypeScript · optional for consumers"
      code="interface NavItem {&#10;  id: string&#10;  label: string&#10;  icon: string | IconifyIcon&#10;  activeIcon?: string | IconifyIcon&#10;  to?: string&#10;  target?: '_self' | '_blank' | '_parent' | '_top'&#10;  disabled?: boolean&#10;  badge?: string | number&#10;}"
    />
    <div class="reference-columns">
      <div>
        <h3>Selection</h3>
        <p>
          <code>update:modelValue(id)</code> supports two-way binding. Without a model or active
          path, the component manages selection internally, starting at <code>defaultActive</code>,
          then a valid <code>featuredId</code>, then the enabled item nearest the middle for circle
          styles (left on ties). Pill and Underline start at the first enabled item.
        </p>
      </div>
      <div>
        <h3>Slots</h3>
        <p>
          <code>#icon="{ item, active }"</code> replaces the icon content.
          <code>#empty</code> customizes the empty state. Keep interactive controls outside icon
          slots.
        </p>
      </div>
    </div>
    <p>
      IDs must be stable, unique and nonempty. Duplicate/empty IDs are ignored. Uncontrolled
      selection falls back to a valid featured ID, then the middle enabled item for circle styles or
      the first enabled item for other styles after removal or disabling. Invalid controlled IDs or
      unmatched paths leave every item in its default state.
    </p>
  </section>

  <section id="theming" class="docs-section reference-section">
    <span class="eyebrow">STATE, COLOR & MOTION</span>
    <h2>A style that belongs in your app.</h2>
    <p>
      Every style has animated active and default states. Icons crossfade, labels transition, and
      selection indicators slide. The Float cutout follows the active item using an animated CSS
      property.
    </p>
    <div class="swatch-grid">
      <div v-for="token in tokens" :key="token[0]" class="swatch">
        <div :style="{ background: token[0] }" />
        <strong>{{ token[0] }}</strong
        ><span>{{ token[1] }}</span>
      </div>
    </div>
    <CodeBlock
      title="CSS · customize an instance"
      code=".mn-root.my-navigation {&#10;  --mn-primary: #3D52A0;&#10;  --mn-accent: #7091E6;&#10;  --mn-muted: #66769D;&#10;  --mn-ring: #ADBBDA;&#10;  --mn-surface: #FFFFFF;&#10;  --mn-on-primary: #FFFFFF;&#10;  --mn-duration: 280ms;&#10;  --mn-easing: cubic-bezier(.22, 1, .36, 1);&#10;}"
    />
    <p>
      Apply <code>class="my-navigation"</code> to the component. Use <code>theme="dark"</code> for
      dark defaults, or inline CSS variables to override them. Every menu item also exposes
      <code>data-state="active"</code> or <code>data-state="default"</code> for custom styling.
    </p>
  </section>

  <section id="accessibility" class="docs-section reference-section">
    <span class="eyebrow">BUILT WITH CARE</span>
    <h2>Useful for everyone.</h2>
    <div class="reference-columns">
      <div>
        <h3><Icon :icon="icons.shield" />Keyboard & screen readers</h3>
        <p>
          Tab reaches enabled items. Enter activates links; Enter or Space activates buttons. Arrow
          keys and Home/End move focus without navigation. Each item has its complete accessible
          label, with <code>aria-current="page"</code> on the active item.
        </p>
      </div>
      <div>
        <h3><Icon :icon="icons.settings" />Motion & small screens</h3>
        <p>
          Reduced-motion preferences disable transitions. Long menus scroll horizontally and
          maintain touch targets. Fixed bars include safe-area padding. Reserve roughly 128px plus
          the device safe area beneath your page content.
        </p>
      </div>
    </div>
    <p>
      Missing active icons use the default icon with active styling. Invalid or unavailable Iconify
      names may leave the icon blank; the accessible label remains. For reliable offline rendering,
      bundle your chosen icons as data.
    </p>
  </section>
</template>
