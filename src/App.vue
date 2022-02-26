<script setup lang="ts">
import Footer from "./components/Footer.vue";

import TopBar from "@/components/TopBar.vue";
import FaqSection from "@/components/FaqSection.vue";
</script>

<template>
  <div id="app">
    <div id="app-main-container">
      <TopBar />
      <router-view />
    </div>
    <FaqSection />
    <Footer />

    <!-- snack bar -->
  </div>
</template>

<style lang="scss">
@use "@/scss/global";
@use "@fontsource/inter/variable-full";
@use "material-icons/iconfont/material-icons.css";

body {
  @include global.primary-text-auto;
  @include global.background-auto;

  margin: 0;
  font-family: "InterVariable", "Roboto", Arial, Helvetica, sans-serif;
  min-width: 320px;
  min-height: 100vh;
  overflow: auto;
  overflow: overlay;
}

#app-main-container {
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}
</style>
