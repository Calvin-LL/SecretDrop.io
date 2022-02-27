<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";

const error = ref<Error>();

onErrorCaptured((err) => {
  error.value = err;
});
</script>

<template>
  <div class="error-broundary" :class="{ 'has-error': error }">
    <slot></slot>
    <Transition>
      <div v-if="error" class="error-overlay">
        <slot name="error-overlay" :error="error"></slot>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
@use "@/scss/global";
@use "@/scss/transitions";

.error-broundary {
  position: relative;

  &.has-error {
    & > *:not(.error-overlay) {
      visibility: hidden;
    }
  }

  & > .error-overlay {
    @include global.absolute-overlay;

    &.v-enter-active {
      transition-property: opacity;
      transition-duration: transitions.$transition-duration-small;
      transition-timing-function: transitions.$transition-timing-function-deceleration;
    }

    &.v-leave-active {
      transition-property: opacity;
      transition-duration: transitions.$transition-duration-small;
      transition-timing-function: transitions.$transition-timing-function-acceleration;
    }

    &.v-enter-from,
    &.v-leave-to {
      opacity: 0;
    }
  }
}
</style>
