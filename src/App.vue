<template>
  <div id="app">
    <TopBar />
    <router-view />
  </div>
</template>

<script lang="ts">
import TopBar from "@/components/TopBar.vue";

export default {
  name: "App",
  components: {
    TopBar,
  },
};
</script>

<style lang="scss">
// @use "@material/theme" with (
//   $primary:  rgba($color: #000000, $alpha: 0.87),
//   $secondary: rgba($color: #000000, $alpha: 0.87),
//   $on-primary: white,
//   $on-secondary: white,
// );

// @media (prefers-color-scheme: dark) {
//   :root {
//     --mdc-theme-primary: #2e7d32;
//     --mdc-theme-secondary: #bf360c;
//     --mdc-theme-background: #{$background};
//     --mdc-theme-surface: #{$dark-background-dark};
//     --mdc-theme-on-surface: #{$primary-text-color-dark};
//     --mdc-theme-text-primary-on-background: #{$primary-text-color-dark};
//     --mdc-theme-text-secondary-on-background: #{$secondary-text-color-dark};
//   }
// }

body {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: "Roboto", Arial, Helvetica, sans-serif;
  color: $primary-text-color;
  background-color: $background;
  min-width: 260px;
  min-height: 100vh;
  overflow-y: overlay;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (prefers-color-scheme: dark) {
    color: $primary-text-color-dark;
    background-color: $background-dark;
  }
}
</style>
