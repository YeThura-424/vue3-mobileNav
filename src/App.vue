<script setup lang="ts">
import { ref } from 'vue';
import AnimatedNav from "./components/AnimatedNav.vue";
import NavBar from "./components/NavBar.vue";

const currentRoute = ref('index');
const customRoutes = [
  { name: 'index', path: '/' },
  { name: 'transaction', path: '/transaction' },
  { name: 'budget', path: '/budget' },
  { name: 'profile', path: '/profile' },
  { name: 'transfer', path: '/transfer' },
  { name: 'income', path: '/income' },
  { name: 'expense', path: '/expense' }
];

const handleRouteChange = (routeName: string) => {
  currentRoute.value = routeName;
  console.log('Route changed to:', routeName);
};
</script>

<template>
  <div class=" bg-[#E5E7EB] w-screen h-screen flex justify-center gap-x-6">
    <div class="w-[360px] bg-[#E5E7EB] border border-[#ddd] shadow-md">
      <div class="content-section h-8 bg-[#fff] py-5 mb-3">
        <p class="text-center font-medium">Current Route: {{ currentRoute }}</p>
      </div>
      <div class="navbar-container w-[360px] fixed bottom-0">
        <NavBar :routes="customRoutes" :initial-active-route="currentRoute" @route-change="handleRouteChange" />
      </div>
    </div>

    <!-- animated nav here  -->
    <div class="w-[360px] bg-[#222327] border border-[#ddd] shadow-md">
      <div class="content-section h-8 bg-[#fff] py-5 mb-3"></div>
      <div class="navbar-container w-[360px] fixed bottom-0">
        <AnimatedNav />
      </div>
    </div>
  </div>

</template>

<style scoped></style>
