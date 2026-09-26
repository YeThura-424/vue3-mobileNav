<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { MobileNav, navPresets } from './components'
import type { NavTheme, NavVariant } from './components'
import { defaultItems, icons } from './docs/icons'
import PresetGallery from './docs/PresetGallery.vue'
import Playground from './docs/Playground.vue'
import ReferenceDocs from './docs/ReferenceDocs.vue'

const theme = ref<NavTheme>('light')
watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value
  },
  { immediate: true },
)
const mobileMenu = ref(false)
const variant = ref<NavVariant>('cradle')
const heroActive = ref('shop')
const heroPillActive = ref('search')
const navLinks = [
  { id: 'overview', label: 'Introduction', icon: icons.book },
  { id: 'installation', label: 'Installation', icon: icons.code },
  { id: 'variants', label: 'Variants', icon: icons.grid },
  { id: 'playground', label: 'Playground', icon: icons.settings },
  { id: 'api', label: 'API reference', icon: icons.code },
  { id: 'theming', label: 'Theming', icon: icons.palette },
  { id: 'accessibility', label: 'Accessibility', icon: icons.shield },
  { id: 'navigation', label: 'Navigation', icon: icons.layers },
  { id: 'contributing', label: 'Contributing', icon: icons.code },
]
const current = ref('overview')
function navigate(id: string) {
  current.value = id
  mobileMenu.value = false
}
function customize(id: NavVariant) {
  variant.value = id
  current.value = 'playground'
  document.getElementById('playground')?.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <a href="#overview" class="brand" @click="navigate('overview')"
      ><span class="brand-mark"> <Icon :icon="icons.layers" /> </span
      ><span>vue<span class="brand-light">mobile</span>nav<span class="brand-dot">.</span></span></a
    >
    <span class="header-divider" /><span class="header-label">Documentation</span
    ><span class="version-tag">v0.1.0</span>
    <div class="header-actions">
      <a
        class="github-link"
        href="https://github.com/YeThura-424/vue3-mobileNav"
        target="_blank"
        rel="noreferrer"
        >View on GitHub <Icon :icon="icons.external" /> </a
      ><button
        class="icon-button"
        :aria-label="theme === 'light' ? 'Use dark theme' : 'Use light theme'"
        @click="theme = theme === 'light' ? 'dark' : 'light'"
      >
        <Icon :icon="theme === 'light' ? icons.moon : icons.sun" /></button
      ><button
        class="icon-button mobile-menu-button"
        aria-controls="sidebar"
        :aria-expanded="mobileMenu"
        aria-label="Toggle documentation menu"
        @click="mobileMenu = !mobileMenu"
      >
        <Icon :icon="icons.menu" />
      </button>
    </div>
  </header>
  <button
    v-if="mobileMenu"
    class="sidebar-backdrop"
    aria-label="Close documentation menu"
    @click="mobileMenu = false"
  />
  <aside id="sidebar" class="sidebar" :class="{ open: mobileMenu }">
    <div class="sidebar-group-label">GET STARTED</div>
    <nav aria-label="Documentation sections">
      <a
        v-for="(link, index) in navLinks"
        :key="link.id"
        :href="'#' + link.id"
        :class="{ active: current === link.id, 'section-break': index === 2 || index === 4 }"
        :aria-current="current === link.id ? 'location' : undefined"
        @click="navigate(link.id)"
      >
        <Icon :icon="link.icon" />{{ link.label
        }}<span v-if="link.id === 'variants'" class="nav-count">{{ navPresets.length }}</span
        ><span v-if="link.id === 'playground'" class="new-tag">LIVE</span>
      </a>
    </nav>
    <div class="sidebar-note">
      <span class="note-icon"> <Icon :icon="icons.code" /> </span
      ><strong>Built for your next idea.</strong>
      <p>Open source. Vue native.<br />Yours to make your own.</p>
      <a href="https://github.com/YeThura-424/vue3-mobileNav" target="_blank" rel="noreferrer"
        >Explore the source
        <Icon :icon="icons.arrow" />
      </a>
    </div>
    <div class="sidebar-footer"><span class="status-dot" />Made with Vue 3 & TypeScript</div>
  </aside>
  <main id="main-content" class="main-content">
    <div class="breadcrumb">
      Documentation <span>/</span> Components <span>/</span> <strong>Mobile navigation</strong>
    </div>
    <section id="overview" class="hero">
      <div class="hero-copy">
        <div class="hero-badge"><span />VUE 3 COMPONENT LIBRARY</div>
        <h1>Small footprint.<br /><span>Big impression.</span></h1>
        <p>
          Beautiful mobile navigation that feels right.<br class="desktop-only" />
          Pick a style, make it yours, and keep building.
        </p>
        <div class="hero-actions">
          <a href="#installation" class="primary-button" @click="navigate('installation')"
            >Get started <Icon :icon="icons.arrow" /> </a
          ><a href="#playground" class="secondary-button" @click="navigate('playground')">
            <Icon :icon="icons.settings" />Open playground
          </a>
        </div>
        <div class="hero-qualities">
          <span> <Icon :icon="icons.check" />Vue 3 + TypeScript </span
          ><span> <Icon :icon="icons.check" />Iconify icons </span
          ><span> <Icon :icon="icons.check" />MIT licensed </span>
        </div>
      </div>
      <div class="hero-showcase">
        <div class="showcase-caption">
          <span>THOUGHTFULLY DESIGNED</span><span>8 ANIMATED STYLES</span>
        </div>
        <div class="hero-nav hero-nav-one">
          <MobileNav
            :theme="theme"
            v-model="heroActive"
            :items="defaultItems"
            variant="cradle"
            featured-id="shop"
            label="Hero cradle example"
          />
        </div>
        <div class="hero-nav hero-nav-two">
          <MobileNav
            :theme="theme"
            :items="defaultItems.filter((item) => item.id !== 'shop')"
            variant="pill"
            v-model="heroPillActive"
            label="Hero pill example"
          />
        </div>
        <div class="showcase-foot"><span class="tiny-line" />Little details. Better journeys.</div>
      </div>
    </section>
    <div class="feature-strip">
      <div>
        <Icon :icon="icons.grid" /><span
          ><strong>8 animated styles</strong><small>One consistent API</small></span
        >
      </div>
      <div>
        <Icon :icon="icons.settings" /><span
          ><strong>Completely configurable</strong><small>Your items, icons & order</small></span
        >
      </div>
      <div>
        <Icon :icon="icons.shield" /><span
          ><strong>Built for real apps</strong><small>Keyboard & motion support</small></span
        >
      </div>
    </div>
    <PresetGallery :theme="theme" @customize="customize" />
    <Playground v-model:variant="variant" v-model:theme="theme" />
    <ReferenceDocs />
    <footer class="site-footer">
      <a class="brand footer-brand" href="#overview">vuemobilenav<span class="brand-dot">.</span></a
      ><span>Crafted by Ye Thura · Open source under MIT</span
      ><a
        href="https://github.com/YeThura-424/vue3-mobileNav/issues"
        target="_blank"
        rel="noreferrer"
        >Found an issue?
        <Icon :icon="icons.external" />
      </a>
    </footer>
  </main>
</template>
