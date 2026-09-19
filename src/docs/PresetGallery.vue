<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { MobileNav, navPresets } from '../components'
import type { NavVariant, NavTheme } from '../components'
import { defaultItems, icons } from './icons'
defineProps<{ theme: NavTheme }>()
const emit = defineEmits<{ customize: [variant: NavVariant] }>()
const filter = ref('all')
const presets = computed(() =>
  navPresets.filter(
    (preset) =>
      filter.value === 'all' || (filter.value === 'featured' ? preset.featured : !preset.featured),
  ),
)
const selection = ref<Record<string, string>>({})
function itemsFor(id: NavVariant) {
  return ['underline', 'pill'].includes(id)
    ? defaultItems.filter((item) => item.id !== 'shop')
    : defaultItems
}
</script>
<template>
  <section id="variants" class="docs-section">
    <div class="section-heading">
      <div>
        <span class="eyebrow">THE COLLECTION</span>
        <h2>Navigation, your way<span class="accent-dot">.</span></h2>
        <p>Eight animated styles. One flexible API. Find your fit.</p>
      </div>
      <span class="count-tag">{{ navPresets.length }} variants</span>
    </div>
    <div class="gallery-toolbar">
      <div class="segmented" aria-label="Filter variants">
        <button
          v-for="option in [
            { id: 'all', label: 'All variants' },
            { id: 'featured', label: 'Featured action' },
            { id: 'simple', label: 'Selection styles' },
          ]"
          :key="option.id"
          :aria-pressed="filter === option.id"
          :class="{ selected: filter === option.id }"
          @click="filter = option.id"
        >
          {{ option.label }}
        </button>
      </div>
      <span class="hint">Click a menu item to try it</span>
    </div>
    <div class="preset-grid">
      <article v-for="preset in presets" :key="preset.id" class="preset-card">
        <div class="preset-stage" :class="{ dark: theme === 'dark' }">
          <MobileNav
            :items="itemsFor(preset.id)"
            :variant="preset.id"
            :theme="theme"
            :model-value="selection[preset.id]"
            :label="`${preset.name} preview`"
            @update:model-value="selection[preset.id] = $event"
          />
        </div>
        <div class="preset-caption">
          <div>
            <h3>
              {{ preset.name }}
            </h3>
            <p>{{ preset.description }}</p>
          </div>
          <button
            class="icon-button"
            :aria-label="`Customize ${preset.name}`"
            @click="emit('customize', preset.id)"
          >
            <Icon :icon="icons.arrow" />
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
