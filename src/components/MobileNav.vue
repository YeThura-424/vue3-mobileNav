<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { NavItem, NavTheme, NavVariant } from './types'
import './mobile-nav.css'

const props = withDefaults(
  defineProps<{
    items: readonly NavItem[]
    modelValue?: string
    defaultActive?: string
    activePath?: string
    navigate?: (destination: string) => unknown
    variant?: NavVariant
    featuredId?: string
    theme?: NavTheme
    position?: 'inline' | 'fixed'
    label?: string
  }>(),
  { variant: 'pill', theme: 'light', position: 'inline', label: 'Main navigation' },
)

const emit = defineEmits<{
  'update:modelValue': [id: string]
  select: [item: NavItem, event: MouseEvent]
  'navigation-error': [error: unknown, item: NavItem]
}>()

const internalId = ref(props.defaultActive ?? '')
const circleStyle = computed(() => ['orbit', 'cradle', 'outline', 'float', 'peak', 'soft-rise'].includes(props.variant))
const nav = ref<HTMLElement>()
// Ignore invalid/duplicate IDs instead of producing ambiguous keys and selections.
const normalizedItems = computed(() => {
  const seen = new Set<string>()
  return props.items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
})
function fallbackId(items: readonly NavItem[]) {
  const featured = items.find(item => item.id === props.featuredId && !item.disabled)
  if (featured) return featured.id
  const center = (items.length - 1) / 2
  return items.map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.disabled)
    .sort((a, b) => circleStyle.value ? Math.abs(a.index - center) - Math.abs(b.index - center) : a.index - b.index)[0]?.item.id ?? ''
}
watch(() => props.featuredId, id => {
  if (props.modelValue === undefined && props.activePath === undefined && normalizedItems.value.some(item => item.id === id && !item.disabled)) internalId.value = id!
})
watch(
  normalizedItems,
  (items) => {
    if (!items.some((item) => item.id === internalId.value && !item.disabled)) {
      internalId.value = fallbackId(items)
    }
  },
  { immediate: true, deep: true },
)

const selectedId = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue
  if (props.activePath !== undefined)
    return normalizedItems.value.find((item) => item.to === props.activePath)?.id ?? ''
  return internalId.value
})
const activeIndex = computed(() =>
  normalizedItems.value.findIndex((item) => item.id === selectedId.value && !item.disabled),
)
const featuredIndex = computed(() => circleStyle.value ? activeIndex.value : -1)
const floatingIndex = activeIndex
const navStyle = computed(() => ({
  '--mn-count': Math.max(normalizedItems.value.length, 1),
  '--mn-feature-x': `${((floatingIndex.value + 0.5) / Math.max(normalizedItems.value.length, 1)) * 100}%`,
  '--mn-active-index': Math.max(activeIndex.value, 0),
  '--mn-indicator-opacity': activeIndex.value < 0 ? 0 : 1,
}))

function destination(item: NavItem) {
  if (item.disabled || !item.to) return undefined
  const value = item.to.trim()
  if (!value || /[\u0000-\u001f\u007f]/.test(value)) return undefined
  // Do not turn executable schemes into anchors or pass them to a router.
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^(https?:|mailto:|tel:)/i.test(value)) return undefined
  return value
}

function select(item: NavItem, event: MouseEvent) {
  if (item.disabled || event.defaultPrevented) {
    event.preventDefault()
    return
  }
  const to = destination(item)
  if (
    to &&
    (event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      (item.target && item.target !== '_self'))
  )
    return
  emit('select', item, event)
  if (event.defaultPrevented) return
  internalId.value = item.id
  emit('update:modelValue', item.id)
  if (to && props.navigate && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(to)) {
    event.preventDefault()
    try {
      Promise.resolve(props.navigate(to)).catch((error) => emit('navigation-error', error, item))
    } catch (error) {
      emit('navigation-error', error, item)
    }
  }
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const buttons = Array.from(
    nav.value?.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>('[data-nav-id]') ?? [],
  )
  const enabled = buttons.filter((button) => !button.hasAttribute('disabled'))
  if (!enabled.length) return
  let target: HTMLButtonElement | HTMLAnchorElement | undefined
  if (event.key === 'Home') target = enabled[0]
  else if (event.key === 'End') target = enabled[enabled.length - 1]
  else {
    const direction = event.key === 'ArrowRight' ? 1 : -1
    let next = index
    for (let count = 0; count < buttons.length; count++) {
      next = (next + direction + buttons.length) % buttons.length
      if (!buttons[next]?.hasAttribute('disabled')) {
        target = buttons[next]
        break
      }
    }
  }
  target?.focus()
  target?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
}
</script>

<template>
  <nav ref="nav" class="mn-root" :class="`mn-${position}`" :data-theme="theme" :aria-label="label">
    <div class="mn-scroller">
      <div
        class="mn-track"
        :class="[`mn-${variant}`, { 'mn-has-feature': floatingIndex >= 0, 'mn-circle': circleStyle }]"
        :style="navStyle"
      >
        <div class="mn-surface" aria-hidden="true" />
        <div v-if="circleStyle && activeIndex >= 0" class="mn-feature-marker" aria-hidden="true" />
        <div
          v-if="['underline', 'pill'].includes(variant)"
          class="mn-indicator"
          aria-hidden="true"
        >
          <span class="mn-indicator-shape" />
        </div>
        <ul v-if="normalizedItems.length" class="mn-items">
          <li v-for="(item, index) in normalizedItems" :key="item.id" class="mn-item">
            <component
              :is="destination(item) ? 'a' : 'button'"
              :type="destination(item) ? undefined : 'button'"
              :href="destination(item)"
              :target="destination(item) ? item.target : undefined"
              :rel="
                destination(item) && item.target === '_blank' ? 'noopener noreferrer' : undefined
              "
              class="mn-button"
              :class="{
                'mn-active': activeIndex === index,
                'mn-featured': featuredIndex === index,
              }"
              :data-nav-id="item.id"
              :data-state="activeIndex === index ? 'active' : 'default'"
              :disabled="item.disabled"
              :aria-label="
                item.label +
                (item.badge !== undefined && item.badge !== ''
                  ? `, ${item.badge} notifications`
                  : '')
              "
              :aria-current="activeIndex === index ? 'page' : undefined"
              @click="select(item, $event)"
              @keydown="onKeydown($event, index)"
            >
              <span class="mn-icon-wrap" aria-hidden="true">
                <slot name="icon" :item="item" :active="activeIndex === index">
                  <span class="mn-glyph" :class="{ 'mn-has-active-icon': !!item.activeIcon }">
                    <Icon :icon="item.icon" class="mn-icon mn-default-icon" />
                    <Icon
                      v-if="item.activeIcon"
                      :icon="item.activeIcon"
                      class="mn-icon mn-active-icon"
                    />
                  </span>
                </slot>
                <span v-if="item.badge !== undefined && item.badge !== ''" class="mn-badge">{{
                  item.badge
                }}</span>
              </span>
              <span class="mn-label" aria-hidden="true">{{ item.label }}</span>
            </component>
          </li>
        </ul>
        <span v-else class="mn-empty"><slot name="empty">No navigation items</slot></span>
      </div>
    </div>
  </nav>
</template>
