<template>
  <!-- <div class="z-10"> -->
  <div class="nav-wrapper bg-[#fff] w-full rounded-t-lg px-3 m-w-[56px]">
    <div class="nav-link-container flex justify-between items-center relative">
      <div class="flex gap-x-10 py-3">
        <router-link to="/">
          <span class="nav-link-item">
            <IconHome :class="[
              'text-3xl',
              activeRoute('index') ? 'text-[#7F3DFF]' : 'text-[#C6C6C6]',
            ]" />
          </span>
        </router-link>
        <router-link to="/transaction">
          <span class="nav-link-item">
            <IconArrowsDoubleSwNe :class="[
              'text-3xl',
              activeRoute('transaction')
                ? 'text-[#7F3DFF]'
                : 'text-[#C6C6C6]',
            ]" />
          </span>
        </router-link>
      </div>
      <div class="flex gap-x-10">
        <router-link to="/budget">
          <span class="nav-link-item">
            <IconChartPie :class="[
              'text-3xl',
              activeRoute('budget') ? 'text-[#7F3DFF]' : 'text-[#C6C6C6]',
            ]" />
          </span>
        </router-link>
        <router-link to="/profile">
          <span class="nav-link-item">
            <IconUser :class="[
              'text-3xl',
              activeRoute('profile') ? 'text-[#7F3DFF]' : 'text-[#C6C6C6]',
            ]" />
          </span>
        </router-link>
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
    <MenuModel :visible="openMenu" @dismiss="closeMenu" />
  </div>
  <!-- </div> -->
</template>
<script setup>
import { IconHome, IconArrowsDoubleSwNe, IconChartPie, IconUser, IconCircleXFilled, IconCirclePlusFilled } from '@tabler/icons-vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Curve from './MenuIcon/Curve.vue';
import Circle from './MenuIcon/Circle.vue';
import { MenuModel } from './additional';

const openMenu = ref(false);
const router = useRoute();

const openMenuDialog = () => {
  openMenu.value = true;
};

const closeMenu = (value) => {
  openMenu.value = value;
};

const activeRoute = (route) => {
  return router?.name === route;
};
</script>
<style scoped>
/* .nav-link-item.center-item::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  background: #fff;
  border-top-right-radius: 20px;
  top: 10px;
  right: 65px;
  box-shadow: 6px -5px 0px 0px #eee;
}

.nav-link-item.center-item::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  background: #fff;
  border-top-left-radius: 20px;
  top: 10px;
  left: 65px;
  box-shadow: -6px -5px 0px 0px #eee;
} */
</style>
