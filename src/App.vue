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
import MDCSnackBar from "@/components/MDCSnackBar.vue";
import TopBar from "@/components/TopBar.vue";
// @ts-ignore
import smoothscroll from "smoothscroll-polyfill";

smoothscroll.polyfill();

export default {
  name: "App",
  components: {
    TopBar,
    Footer,
    FAQ,
    MDCSnackBar,
  },
};
</script>

<style lang="scss">
@import "assets/scss/global";

body {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  color: $primary-text-color;
  background-color: $background;
  min-width: 260px;
  min-height: 100vh;
  overflow: overlay;
  overflow: auto;

  @media (prefers-color-scheme: dark) {
    color: $primary-text-color-dark;
    background-color: $background-dark;
  }
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
