<script setup lang="ts">
import {
  SNACKBAR_ANIMATION_CLOSE_TIME_MS,
  SNACKBAR_ANIMATION_OPEN_TIME_MS,
  snackbarMessage,
} from "@/snackbar-manager";
</script>

<template>
  <div id="snackbar-container">
    <Transition>
      <div v-if="snackbarMessage" class="snackbar">
        {{ snackbarMessage }}
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
@use "@/scss/global";
@use "@/scss/colors";
@use "@/scss/transitions";
@use "@/scss/shadows";

#snackbar-container {
  @include global.flex-center;

  position: fixed;
  bottom: 0px;

  width: 100%;

  & > .snackbar {
    @include shadows.shadow(6);

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    height: 48px;
    width: min(344px, calc(100% - 16px));

    @media (max-width: 480px) {
      width: calc(100% - 16px);
    }

    border-radius: 24px;

    padding-left: 20px;
    padding-right: 20px;

    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 8px;

    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 300;
    letter-spacing: 0.0178571429em;

    box-sizing: border-box;

    background-color: colors.$snackbar-background-color;
    color: colors.$primary-text-color-dark;

    &.v-enter-active {
      transition-property: transform, opacity;
      transition-duration: calc(v-bind(SNACKBAR_ANIMATION_OPEN_TIME_MS) * 1ms);
      transition-timing-function: transitions.$transition-timing-function-deceleration;
    }

    &.v-leave-active {
      transition-property: transform, opacity;
      transition-duration: calc(v-bind(SNACKBAR_ANIMATION_CLOSE_TIME_MS) * 1ms);
      transition-timing-function: transitions.$transition-timing-function-acceleration;
    }

    &.v-enter-from {
      transform: scale(0);
      opacity: 0;
    }

    &.v-leave-to {
      opacity: 0;
    }
  }
}
</style>
