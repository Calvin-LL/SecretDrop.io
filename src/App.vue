<script setup lang="ts">
import Snackbar from "./components/Snackbar.vue";
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

    <Snackbar />
  </div>
</template>

<style lang="scss">
@use "@/scss/global";
@use "@fontsource/roboto/300" as *;
@use "@fontsource/roboto/400" as *;
@use "@fontsource/roboto/500" as *;
@use "material-icons/iconfont/material-icons.css";

.icon {
  user-select: none;
}

body {
  @include global.primary-text-auto;
  @include global.background-auto;

  margin: 0;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
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
