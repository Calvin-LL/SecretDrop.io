<script setup lang="ts">
import safeSvg from "@/assets/safe.svg?raw";
import parachuteSvg from "@/assets/parachute.svg?raw";

defineProps<{
  animate?: boolean;
  animateOnHover?: boolean;
  tilted?: boolean;
  width: string;
}>();
</script>

<template>
  <div
    class="animated-logo"
    :class="{ animate, tilted, 'animate-on-hover': animateOnHover }"
    :style="{ width }"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="parachute-svg-container" v-html="parachuteSvg" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="safe-svg-container" v-html="safeSvg" />
  </div>
</template>

<style lang="scss">
.animated-logo {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  transform-origin: 50% 80%;

  &.tilted {
    transform: rotate(-5deg);
  }

  &.animate,
  &.animate-on-hover:hover {
    animation: swing ease-in-out 1s infinite alternate;

    & > .safe-svg-container > svg {
      animation: swing-little ease-in-out 1s infinite alternate-reverse;

      // the dots on the safe
      & > .dial-marks {
        transform-origin: center;
        animation: turning-dial ease-in-out 1s infinite alternate-reverse;
      }
    }
  }

  & > .parachute-svg-container {
    display: contents;

    & > svg {
      backface-visibility: hidden;
      width: 100%;
    }
  }

  & > .safe-svg-container {
    display: contents;

    & > svg {
      backface-visibility: hidden;
      width: 44%;
      margin-top: -10%;
    }
  }
}

@keyframes swing {
  0% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(-5deg);
  }
}

@keyframes swing-little {
  0% {
    transform: rotate(2deg);
  }
  100% {
    transform: rotate(-2deg);
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
