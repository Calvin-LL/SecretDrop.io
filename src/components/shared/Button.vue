<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";

withDefaults(
  defineProps<{
    iconStyle?: "round" | "outlined";
    icon?: string;
    text?: string;
    raised?: boolean;
    to?: RouteLocationRaw;
    textColor?: "vivid" | "primary" | "secondary";
  }>(),
  {
    iconStyle: "round",
    textColor: "vivid",
  }
);
</script>

<template>
  <router-link
    v-if="to"
    class="button"
    :class="[{ raised }, textColor]"
    :to="to"
  >
    <span class="icon" :class="`material-icons-${iconStyle}`">{{ icon }}</span>
    <span class="label">{{ text }}</span>
  </router-link>
  <button v-else class="button" :class="[{ raised }, textColor]" :to="to">
    <span class="icon" :class="`material-icons-${iconStyle}`">{{ icon }}</span>
    <span class="label">{{ text }}</span>
  </button>
</template>

<style lang="scss">
@use "@/scss/global";
@use "@/scss/colors";
@use "@/scss/transitions";
@use "@/scss/shadows";

.button {
  all: unset;

  user-select: none;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;

  padding-right: 16px;
  padding-left: 16px;

  height: 36px;
  border-radius: 18px;

  background: transparent;

  transition-property: background, box-shadow;
  transition-duration: transitions.$transition-duration-minuscule;
  transition-timing-function: transitions.$transition-timing-function-standard;

  &.vivid {
    color: colors.$theme-color;
  }

  &.primary {
    @include global.primary-text-auto;
  }

  &.secondary {
    @include global.secondary-text-auto;
  }

  &:hover {
    background-color: rgba(colors.$theme-color, 0.08);
  }

  &:focus-visible {
    background-color: rgba(colors.$theme-color, 0.12);
  }

  &:active {
    background-color: rgba(colors.$theme-color, 0.24);
  }

  &.raised {
    @include shadows.shadow(1);

    background: colors.$theme-color;
    color: white;

    &:hover {
      @include shadows.shadow(4);

      background-color: rgba(colors.$theme-color, 0.9);
    }

    &:focus-visible {
      @include shadows.shadow(2);

      background-color: rgba(colors.$theme-color, 0.8);
    }

    &:active {
      @include shadows.shadow(8);

      background-color: rgba(colors.$theme-color, 0.7);
    }
  }

  .label {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;

    text-decoration: none;
    text-transform: uppercase;

    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.0892857143em;
  }
}
</style>
