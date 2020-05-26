<template>
  <div class="animated-logo">
    <img class="parachute-svg" src="@/assets/images/parachute.svg" />
    <img class="safe-svg" src="@/assets/images/safe.svg" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AnimatedLogo",
});
</script>

<style lang="scss">
.animated-logo {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  transform-origin: 50% 80%;

  &.animate,
  &.animate-on-hover:hover {
    animation: swing ease-in-out 1s infinite alternate;

    .safe-svg {
      animation: swing-little ease-in-out 1s infinite alternate-reverse;
    }
  }

  & > .parachute-svg {
    -webkit-backface-visibility: hidden;
    width: 100%;
  }

  & > .safe-svg {
    -webkit-backface-visibility: hidden;
    width: 44%;
    margin-top: -10%;
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
</style>
