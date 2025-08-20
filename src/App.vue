<script setup lang="ts">
import NavBar from "./components/NavBar.vue";

</script>

<template>
  <div class="main-container flex justify-center items-center bg-[#E5E7EB] h-screen w-screen">
    <div class=" w-[500px] h-[500px] ">
      <div class="content-section h-8 bg-[#fff] py-5 mb-3"></div>
      <div class="navbar-container relative">
        <NavBar />
      </div>
    </div>
  </div>

</template>

<style scoped></style>
