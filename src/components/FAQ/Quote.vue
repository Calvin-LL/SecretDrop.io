<template>
  <div class="quote">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Quote",
});
</script>

<style scoped lang="scss">
.quote {
  contain: content;

  border-radius: 4px;

  padding: 8px;

  background-color: rgba($color: #000, $alpha: 0.1);

  @media (prefers-color-scheme: dark) {
    background-color: rgba($color: #fff, $alpha: 0.1);
  }
}
</style>
