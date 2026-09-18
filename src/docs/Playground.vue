<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { MobileNav, navPresets } from '../components'
import type { NavItem, NavVariant, NavTheme } from '../components'
import { freshItems, icons } from './icons'
import CodeBlock from './CodeBlock.vue'

const props = defineProps<{ variant: NavVariant }>()
const emit = defineEmits<{ 'update:variant': [variant: NavVariant] }>()
const items = ref(freshItems())
// Keep previews as buttons, including modifier clicks; exports retain real destinations.
const previewItems = computed(() =>
  items.value.map((item) => ({ ...item, to: undefined, target: undefined })),
)
const active = ref('shop')
const featured = ref('shop')
const theme = defineModel<NavTheme>('theme', { default: 'light' })
const previewPath = ref('/shop')
const integration = ref<'router' | 'native'>('router')
watch(active, id => {
  featured.value = id
  previewPath.value = items.value.find(item => item.id === id)?.to || '(action)'
})
let nextId = 1
function add() {
  const id = `item-${nextId++}`
  items.value.push({ id, label: 'New item', icon: 'solar:settings-linear', to: `/${id}` })
}
function remove(index: number) {
  const removed = items.value.splice(index, 1)[0]
  if (removed?.id === active.value)
    active.value = items.value.find((item) => !item.disabled)?.id ?? ''
}
function move(index: number, direction: number) {
  const target = index + direction
  if (target < 0 || target >= items.value.length) return
  const item = items.value.splice(index, 1)[0]!
  items.value.splice(target, 0, item)
}
function reset() {
  items.value = freshItems()
  active.value = 'shop'
  featured.value = 'shop'
  previewPath.value = '/shop'
}
function previewSelect(item: NavItem, event: MouseEvent) {
  event.preventDefault()
  active.value = item.id
  previewPath.value = items.value.find((entry) => entry.id === item.id)?.to || '(action)'
}
const snippet = computed(() => {
  const data = JSON.stringify(items.value, null, 2).replace(/</g, '\\u003c')
  const routerImports =
    integration.value === 'router' ? "import { useRoute, useRouter } from 'vue-router'\n" : ''
  const routerSetup =
    integration.value === 'router' ? '\nconst route = useRoute()\nconst router = useRouter()\n' : ''
  const selection =
    integration.value === 'router'
      ? ':active-path="route.path"\n    :navigate="router.push"'
      : `default-active="${active.value}"`
  return (
    `<script setup lang="ts">\n${routerImports}import { MobileNav } from 'vue3-mobile-nav'\nimport type { NavItem } from 'vue3-mobile-nav'\nimport 'vue3-mobile-nav/style.css'\n${routerSetup}\nconst items: NavItem[] = ${data}\n<` +
    `/script>\n\n<template>\n  <MobileNav\n    :items="items"\n    ${selection}\n    variant="${props.variant}"\n    theme="${theme.value}"${featured.value ? `\n    featured-id="${featured.value}"` : ''}\n  />\n</template>`
  )
})
</script>
<template>
  <section id="playground" class="docs-section">
    <div class="section-heading">
      <div>
        <span class="eyebrow">MAKE IT YOURS</span>
        <h2>A little playground. A lot of possibility.</h2>
        <p>Change the details. See them live. Take the code with you.</p>
      </div>
    </div>
    <div class="playground-layout">
      <div class="playground-controls panel">
        <div class="panel-title">
          <h3>Configuration</h3>
          <button class="text-button" @click="reset"><Icon :icon="icons.reset" />Reset</button>
        </div>
        <div class="field-row">
          <label
            >Variant<select
              :value="variant"
              @change="
                emit('update:variant', ($event.target as HTMLSelectElement).value as NavVariant)
              "
            >
              <option v-for="preset in navPresets" :key="preset.id" :value="preset.id">
                {{ preset.name }}
              </option>
            </select></label
          ><label
            >Active / featured item<select v-model="active">
              <option value="">None</option>
              <option v-for="item in items" :key="item.id" :value="item.id">
                {{ item.label }}
              </option>
            </select></label
          >
        </div>
        <div class="items-heading">
          <h4>
            Menu items <span>{{ items.length }}</span>
          </h4>
          <button class="text-button" @click="add"><Icon :icon="icons.plus" />Add item</button>
        </div>
        <div class="item-editor-list">
          <div v-for="(item, index) in items" :key="item.id" class="item-editor">
            <div class="item-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="item-fields">
              <label class="sr-only" :for="`label-${item.id}`">Label for item {{ index + 1 }}</label
              ><input
                :id="`label-${item.id}`"
                v-model="item.label"
                placeholder="Menu label"
              /><label :for="`icon-${item.id}`">Default icon</label
              ><input
                :id="`icon-${item.id}`"
                v-model="item.icon"
                placeholder="solar:home-2-linear"
              />
              <label :for="`active-icon-${item.id}`">Active icon</label>
              <input
                :id="`active-icon-${item.id}`"
                v-model="item.activeIcon"
                placeholder="Same icon if empty"
              />
              <label :for="`destination-${item.id}`">Destination</label>
              <input
                :id="`destination-${item.id}`"
                v-model="item.to"
                placeholder="/profile · leave empty for an action"
              />
            </div>
            <div class="item-actions">
              <button
                class="icon-button"
                :disabled="index === 0"
                :aria-label="`Move ${item.label} up`"
                @click="move(index, -1)"
              >
                <Icon :icon="icons.up" /></button
              ><button
                class="icon-button"
                :disabled="index === items.length - 1"
                :aria-label="`Move ${item.label} down`"
                @click="move(index, 1)"
              >
                <Icon :icon="icons.down" /></button
              ><button
                class="icon-button"
                :aria-label="`Remove ${item.label}`"
                @click="remove(index)"
              >
                <Icon :icon="icons.close" />
              </button>
            </div>
          </div>
          <p v-if="!items.length" class="empty-editor">
            Start with an item. Add as many as your app needs.
          </p>
        </div>
        <p class="field-help">
          Array order is menu order. Use any
          <a href="https://icon-sets.iconify.design/" target="_blank" rel="noreferrer"
            >Iconify icon name <Icon :icon="icons.external" /></a
          >. Custom names load from the Iconify API.
        </p>
      </div>
      <div class="preview-column">
        <div class="live-preview panel" :class="{ dark: theme === 'dark' }">
          <div class="panel-title">
            <span class="live-label"><span />LIVE PREVIEW</span
            ><button
              class="icon-button"
              :aria-label="theme === 'light' ? 'Use dark theme' : 'Use light theme'"
              @click="theme = theme === 'light' ? 'dark' : 'light'"
            >
              <Icon :icon="theme === 'light' ? icons.moon : icons.sun" />
            </button>
          </div>
          <div class="preview-content">
            <Icon
              :icon="icons[active === 'home' ? 'home' : active === 'shop' ? 'shop' : 'layers']"
            />
            <p>{{ items.find((item) => item.id === active)?.label ?? 'Your next destination' }}</p>
            <span>Good navigation feels effortless.</span>
          </div>
          <MobileNav
            v-model="active"
            :items="previewItems"
            :variant="variant"
            :featured-id="featured"
            :theme="theme"
            @select="previewSelect"
            label="Playground navigation"
          />
        </div>
        <div class="preview-meta">
          <span>{{ items.length }} items</span
          ><span
            >Selected: <code>{{ active || 'none' }}</code></span
          ><span role="status"
            >Destination: <code>{{ previewPath }}</code></span
          >
        </div>
      </div>
    </div>
    <details class="generated-code">
      <summary>
        <Icon :icon="icons.code" />Get your component code<span>Vue + TypeScript</span>
      </summary>
      <label class="export-mode"
        >Navigation mode<select v-model="integration">
          <option value="router">Vue Router</option>
          <option value="native">Native links</option>
        </select></label
      >
      <CodeBlock :code="snippet" title="YourNavigation.vue" />
    </details>
  </section>
</template>
