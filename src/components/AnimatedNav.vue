<template>
  <div class="relative w-[360px] h-[48px] bg-white flex items-center justify-center px-5">
    <ul class="flex justify-between w-full relative">
      <li v-for="(item, index) in navItems" :key="index"
        class="relative w-[70px] h-[70px] z-10 flex flex-col items-center justify-center cursor-pointer"
        @click="setActive(index)">
        <a class="flex flex-col items-center justify-center font-medium">
          <!-- Tabler Icon -->
          <component :is="item.icon" class="transition-all duration-500 w-[22px] h-[22px]" :class="[
            activeIndex === index
              ? 'text-[#7F3DFF] -translate-y-8'
              : 'text-gray-900 translate-y-0',
          ]" />

          <!-- Text -->
          <span class="absolute transition-all duration-500 text-gray-900 text-sm" :class="[
            activeIndex === index
              ? 'opacity-100 translate-y-2'
              : 'opacity-0 translate-y-5',
          ]">
            {{ item.text }}
          </span>
        </a>
      </li>

      <!-- Moving Indicator -->
      <li class="absolute top-[10.5px] left-[-22px] transition-transform duration-300 z-0"
        :style="{ transform: `translateX(${indicatorX}px)` }">
        <Curve />
      </li>
      <li class="absolute top-[-14px] left-[7px] transition-transform duration-300 z-0"
        :style="{ transform: `translateX(${indicatorX}px)` }">
        <Circle />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Curve from './MenuIcon/Curve.vue';
import Circle from './MenuIcon/Circle.vue';
import {
  IconHome,
  IconInfoCircle,
  IconUser,
  IconSettings,
} from "@tabler/icons-vue";

const navItems = [
  { icon: IconHome, text: "Home" },
  { icon: IconInfoCircle, text: "About" },
  { icon: IconUser, text: "Profile" },
  { icon: IconSettings, text: "Settings" },
];

const activeIndex = ref(0);

function setActive(index) {
  activeIndex.value = index;
}

const indicatorX = computed(() => {
  return activeIndex.value * 82; // 70px width + ~12px spacing
});
</script>
