<template>
  <!-- <div class="z-10"> -->
  <div class="nav-wrapper relative bg-[#fff] w-full rounded-t-lg px-3">
    <div class="nav-link-container flex justify-between items-center relative">
      <div class="flex gap-x-10 py-3">
        <a href="#" @click.prevent="setActiveRoute(routes[0].name)">
          <span class="nav-link-item">
            <IconHome :class="[
              'text-3xl',
              activeRoute === routes[0].name ? 'text-[#7F3DFF]' : 'text-[#C6C6C6]',
            ]" />
          </span>
        </a>
        <a href="#" @click.prevent="setActiveRoute(routes[1].name)">
          <span class="nav-link-item">
            <IconArrowsDoubleSwNe :class="[
              'text-3xl',
              activeRoute === routes[1].name
                ? 'text-[#7F3DFF]'
                : 'text-[#C6C6C6]',
            ]" />
          </span>
        </a>
      </div>
      <div class="flex gap-x-10">
        <a href="#" @click.prevent="setActiveRoute(routes[2].name)">
          <span class="nav-link-item">
            <IconChartPie :class="[
              'text-3xl',
              activeRoute === routes[2].name ? 'text-[#7F3DFF]' : 'text-[#C6C6C6]',
            ]" />
          </span>
        </a>
        <a href="#" @click.prevent="setActiveRoute(routes[3].name)">
          <span class="nav-link-item">
            <IconUser :class="[
              'text-3xl',
              activeRoute === routes[3].name ? 'text-[#7F3DFF]' : 'text-[#C6C6C6]',
            ]" />
          </span>
        </a>
      </div>
    </div>
    <!-- center icon  -->
    <div
      class="z-10 justify-center flex items-center nav-link-item center-item absolute left-1/2 -translate-x-1/2 bottom-[20px]">
      <IconCircleXFilled v-if="openMenu" class="text-6xl text-[#7F3DFF]" :size="48" @click="openMenuDialog" />
      <IconCirclePlusFilled v-else class="text-6xl text-[#7F3DFF]" :size="40" @click="openMenuDialog" />
    </div>
    <div class="absolute left-1/2 -translate-x-1/2 top-0">
      <Curve />
    </div>
    <div class="absolute left-1/2 -translate-x-1/2 bottom-5">
      <Circle />
    </div>
    <MenuModel :visible="openMenu" :active-route="activeRoute" @dismiss="closeMenu"
      @route-change="handleMenuRouteChange" />
  </div>
  <!-- </div> test -->
</template>
<script setup>
import { IconHome, IconArrowsDoubleSwNe, IconChartPie, IconUser, IconCircleXFilled, IconCirclePlusFilled } from '@tabler/icons-vue';
import { ref, defineProps, defineEmits } from 'vue';
import Curve from './MenuIcon/Curve.vue';
import Circle from './MenuIcon/Circle.vue';
import { MenuModel } from './additional';

const props = defineProps({
  routes: {
    type: Array,
    default: () => [
      { name: 'index', path: '/' },
      { name: 'transaction', path: '/transaction' },
      { name: 'budget', path: '/budget' },
      { name: 'profile', path: '/profile' }
    ]
  },
  initialActiveRoute: {
    type: String,
    default: 'index'
  }
});

const emit = defineEmits(['route-change']);

const openMenu = ref(false);
const activeRoute = ref(props.initialActiveRoute);

const openMenuDialog = () => {
  openMenu.value = true;
};

const closeMenu = (value) => {
  openMenu.value = value;
};

const setActiveRoute = (routeName) => {
  activeRoute.value = routeName;
  emit('route-change', routeName);
};

const handleMenuRouteChange = (routeName) => {
  setActiveRoute(routeName);
};
</script>
