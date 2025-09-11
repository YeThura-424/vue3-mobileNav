<script setup lang="ts">
import NavBar from "./components/NavBar.vue";

</script>

<template>
  <div class=" bg-[#E5E7EB] w-screen h-screen flex justify-center">
    <div class="w-[360px] bg-[#E5E7EB] border border-[#ddd] shadow-md">
      <div class="content-section h-8 bg-[#fff] py-5 mb-3"></div>
      <div class="navbar-container w-[360px] fixed bottom-0">
        <NavBar />
      </div>
    </div>
  </div>

</template>

<style scoped></style>
