<template>
  <div class="animated-logo">
    <img class="parachute-svg" src="@/assets/images/parachute.svg" svg-inline />
    <img class="safe-svg" src="@/assets/images/safe.svg" svg-inline />
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

    > .safe-svg {
      animation: swing-little ease-in-out 1s infinite alternate-reverse;

      // the dots on the safe
      .cls-4 {
        transform-origin: center;
        animation: turning-dial ease-in-out 1s infinite alternate-reverse;
      }
    }
  }

  & > .parachute-svg {
    -webkit-backface-visibility: hidden;
    width: 100%;

    .cls-1 {
      fill: #666;
    }
    .cls-2 {
      fill: #76d275;
    }
    .cls-3 {
      fill: #43a047;
    }
  }

  & > .safe-svg {
    -webkit-backface-visibility: hidden;
    width: 44%;
    margin-top: -10%;

    .cls-1 {
      fill: #78909c;
    }
    .cls-2 {
      fill: #90a4ae;
    }
    .cls-3 {
      fill: #37474f;
    }
    .cls-4 {
      fill: #b0bec5;
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
