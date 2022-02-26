<script setup lang="ts">
import safeSvg from "@/assets/safe.svg?raw";

defineProps<{
  width: string;
}>();
</script>

<template>
  <div class="animated-safe" :style="{ width }">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="safe-svg-container" v-html="safeSvg" />
  </div>
</template>

<style lang="scss">
.animated-safe {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > .safe-svg-container {
    display: contents;

    & > svg {
      backface-visibility: hidden;
      transform-origin: center;
      animation: turning-dial ease-in-out 1s infinite;

      & > .dial-marks {
        transform-origin: center;
        animation: turning-dial ease-in-out 500ms infinite alternate-reverse;
      }
    }
  }
}

@keyframes turning-dial {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
