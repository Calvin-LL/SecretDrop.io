<script setup lang="ts">
defineProps<{
  show?: boolean;
}>();

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <Transition>
    <button
      v-show="show"
      class="scoll-to-top-button"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      <span class="icon material-icons-round">keyboard_arrow_up</span>
    </button>
  </Transition>
</template>

<style lang="scss">
@use "sass:color";
@use "@/scss/global";
@use "@/scss/colors";
@use "@/scss/transitions";
@use "@/scss/shadows";

.scoll-to-top-button {
  all: unset;
  -webkit-tap-highlight-color: transparent;

  position: fixed;
  bottom: 1rem;
  right: 1rem;

  @media (min-width: 1024px) {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;
  cursor: pointer;

  height: 56px;
  width: 56px;
  border-radius: 28px;

  background: transparent;

  transition-property: background, box-shadow;
  transition-duration: transitions.$transition-duration-small;
  transition-timing-function: transitions.$transition-timing-function-standard;

  @include shadows.shadow(6, colors.$theme-color-bright);

  background: colors.$theme-color;
  color: white;

  @media (hover: hover) {
    &:hover {
      @include shadows.shadow(8, colors.$theme-color-bright);

      background-color: color.scale(colors.$theme-color, $lightness: 8%);
    }
  }

  &:focus-visible {
    @include shadows.shadow(8, colors.$theme-color-bright);

    background-color: color.scale(colors.$theme-color, $lightness: 12%);
  }

  &:active {
    @include shadows.shadow(12, colors.$theme-color-bright);

    background-color: color.scale(colors.$theme-color, $lightness: 24%);
  }

  &.v-enter-active {
    transition-property: transform, opacity;
    transition-duration: transitions.$transition-duration-tiny;
    transition-timing-function: transitions.$transition-timing-function-deceleration;
  }

  &.v-leave-active {
    transition-property: transform, opacity;
    transition-duration: transitions.$transition-duration-tiny;
    transition-timing-function: transitions.$transition-timing-function-acceleration;
  }

  &.v-enter-from,
  &.v-leave-to {
    transform: scale(0);
    opacity: 0;
  }

  & > .icon {
    height: 24px;
    width: 24px;
  }
}
</style>
