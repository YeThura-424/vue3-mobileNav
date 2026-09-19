<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { icons } from './icons'
defineProps<{ code: string; title?: string }>()
const status = ref('')
async function copy(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    status.value = 'Copied'
  } catch {
    status.value = 'Select the code to copy manually'
  }
}
</script>
<template>
  <div class="code-block">
    <div class="code-toolbar">
      <span>{{ title ?? 'Vue' }}</span
      ><button type="button" @click="copy(code)">
        <Icon :icon="icons.copy" />{{ status === 'Copied' ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre tabindex="0"><code>{{ code }}</code></pre>
    <span class="sr-only" role="status">{{ status }}</span>
  </div>
</template>
