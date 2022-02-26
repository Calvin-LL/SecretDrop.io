<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";

withDefaults(
  defineProps<{
    iconStyle?: "round" | "outlined";
    icon?: string;
    text?: string;
    buttonStyle?: "raised" | "flat" | "filled";
    to?: RouteLocationRaw;
    textColor?: "vivid" | "primary" | "secondary";
    tintedBackground?: boolean;
  }>(),
  {
    iconStyle: "round",
    textColor: "primary",
    style: "flat",
  }
);
</script>

<template>
  <router-link
    v-if="to"
    class="button"
    :class="[
      buttonStyle,
      `text-color-${textColor}`,
      { icon },
      { tinted: tintedBackground },
    ]"
    :to="to"
  >
    <span class="icon" :class="`material-icons-${iconStyle}`">{{ icon }}</span>
    <span class="label">{{ text }}</span>
  </router-link>
  <button
    v-else
    class="button"
    :class="[
      buttonStyle,
      `text-color-${textColor}`,
      { icon },
      { tinted: tintedBackground },
    ]"
    :to="to"
  >
    <span class="icon" :class="`material-icons-${iconStyle}`">{{ icon }}</span>
    <span class="label">{{ text }}</span>
  </button>
</template>

<style lang="scss">
@use "sass:color";
@use "@/scss/global";
@use "@/scss/colors";
@use "@/scss/transitions";
@use "@/scss/shadows";

.button {
  all: unset;
  -webkit-tap-highlight-color: transparent;

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
  transition-duration: transitions.$transition-duration-tiny;
  transition-timing-function: transitions.$transition-timing-function-standard;

  &.text-color-vivid {
    color: colors.$theme-color;
  }

  &.text-color-primary {
    @include global.primary-text-auto;
  }

  &.text-color-secondary {
    @include global.secondary-text-auto;
  }

  &.icon {
    min-width: unset;

    width: 48px;
    height: 48px;

    border-radius: 24px;
  }

  @media (hover: hover) {
    &:hover {
      background-color: rgba(colors.$primary-text-color, 0.08);

      &.tinted {
        background-color: rgba(colors.$theme-color, 0.08);
      }
    }
  }

  &:focus-visible {
    background-color: rgba(colors.$primary-text-color, 0.12);

    &.tinted {
      background-color: rgba(colors.$theme-color, 0.12);
    }
  }

  &:active {
    background-color: rgba(colors.$primary-text-color, 0.24);

    &.tinted {
      background-color: rgba(colors.$theme-color, 0.24);
    }
  }

  &.raised {
    @include shadows.shadow(1, colors.$theme-color-bright);

    background: colors.$theme-color;
    color: white;

    @media (hover: hover) {
      &:hover {
        @include shadows.shadow(4, colors.$theme-color-bright);

        background-color: color.scale(colors.$theme-color, $lightness: 8%);
      }
    }

    &:focus-visible {
      @include shadows.shadow(4, colors.$theme-color-bright);

      background-color: color.scale(colors.$theme-color, $lightness: 12%);
    }

    &:active {
      @include shadows.shadow(8, colors.$theme-color-bright);

      background-color: color.scale(colors.$theme-color, $lightness: 24%);
    }
  }

  .label {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;

    text-decoration: none;
    text-transform: uppercase;

    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.0892857143em;
  }
}
</style>
