<template>
  <div id="app">
    <div id="app-main-container">
      <TopBar />
      <router-view />
    </div>
    <FAQ />
    <Footer />

    <MDCSnackBar />
  </div>
</template>

<script lang="ts">
import FAQ from "@/components/FAQ.vue";
import Footer from "@/components/Footer.vue";
import MDCSnackBar from "@/components/MDC/MDCSnackBar.vue";
import TopBar from "@/components/TopBar.vue";
import delay from "delay";
// @ts-ignore
import smoothscroll from "smoothscroll-polyfill";
import Vue from "vue";

smoothscroll.polyfill();

export default Vue.extend({
  name: "App",
  components: {
    TopBar,
    Footer,
    FAQ,
    MDCSnackBar,
  },
});
</script>

<style lang="scss">
@use "assets/scss/global";

body {
  @include global.primary-text-auto;
  @include global.background-auto;

  display: flex;
  flex-direction: column;
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
