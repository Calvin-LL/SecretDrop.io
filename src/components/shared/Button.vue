<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    iconStyle?: "round" | "outlined";
    icon?: string;
    text?: string;
    buttonStyle?: "raised" | "flat" | "filled" | "fab";
    href?: string;
    textColor?: "vivid" | "primary" | "secondary";
    color?: "green" | "red";
    tintedBackground?: boolean;
    ariaLabel?: string;
  }>(),
  {
    iconStyle: "round",
    buttonStyle: "flat",
    textColor: "primary",
    color: "green",
  }
);

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();

const classes = computed(() => [
  props.buttonStyle,
  props.color,
  `text-color-${props.textColor}`,
  { icon: !props.text && props.icon },
  { tinted: props.tintedBackground },
]);
</script>

<template>
  <a
    v-if="href"
    class="button"
    :class="classes"
    :href="href"
    rel="noopener noreferrer"
    :aria-label="ariaLabel"
  >
    <span v-if="icon" class="icon" :class="`material-icons-${iconStyle}`">{{
      icon
    }}</span>
    <span v-if="text" class="label">{{ text }}</span>
  </a>
  <button
    v-else
    class="button"
    :class="classes"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <span v-if="icon" class="icon" :class="`material-icons-${iconStyle}`">{{
      icon
    }}</span>
    <span v-if="text" class="label">{{ text }}</span>
  </button>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "@/scss/global";
@use "@/scss/colors";
@use "@/scss/transitions";
@use "@/scss/shadows";
@use "@/scss/button";

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

  padding-right: 12px;
  padding-left: 12px;

  height: 36px;
  border-radius: 18px;

  background: transparent;

  transition-property: background, box-shadow;
  transition-duration: transitions.$transition-duration-tiny;
  transition-timing-function: transitions.$transition-timing-function-standard;

  text-shadow: 0 1px 0 rgb(0 0 0 / 0.06);

  &.text-color-vivid {
    &.green {
      color: colors.$theme-color;

      @media (prefers-color-scheme: dark) {
        color: colors.$theme-color-bright;
      }
    }
    &.red {
      color: colors.$decrypt-color;

      @media (prefers-color-scheme: dark) {
        color: colors.$decrypt-color-bright;
      }
    }
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

      @media (prefers-color-scheme: dark) {
        background-color: rgba(colors.$primary-text-color-dark, 0.08);
      }

      &.tinted.green {
        background-color: rgba(colors.$theme-color, 0.08);

        @media (prefers-color-scheme: dark) {
          background-color: rgba(colors.$theme-color-bright, 0.08);
        }
      }

      &.tinted.red {
        background-color: rgba(colors.$decrypt-color, 0.08);

        @media (prefers-color-scheme: dark) {
          background-color: rgba(colors.$decrypt-color-bright, 0.08);
        }
      }
    }
  }

  &:focus-visible {
    background-color: rgba(colors.$primary-text-color, 0.12);

    outline-color: colors.$primary-text-color;
    outline-style: solid;
    outline-width: 2px;

    @media (prefers-color-scheme: dark) {
      outline-color: colors.$primary-text-color-dark;
    }

    &.tinted.green {
      background-color: rgba(colors.$theme-color, 0.12);

      @media (prefers-color-scheme: dark) {
        background-color: rgba(colors.$theme-color-bright, 0.12);
      }
    }

    &.tinted.red {
      background-color: rgba(colors.$decrypt-color, 0.12);

      @media (prefers-color-scheme: dark) {
        background-color: rgba(colors.$decrypt-color-bright, 0.12);
      }
    }
  }

  &:active {
    background-color: rgba(colors.$primary-text-color, 0.24);

    @media (prefers-color-scheme: dark) {
      background-color: rgba(colors.$primary-text-color-dark, 0.24);
    }

    &.tinted.green {
      background-color: rgba(colors.$theme-color, 0.24);

      @media (prefers-color-scheme: dark) {
        background-color: rgba(colors.$theme-color-bright, 0.24);
      }
    }

    &.tinted.red {
      background-color: rgba(colors.$decrypt-color, 0.24);

      @media (prefers-color-scheme: dark) {
        background-color: rgba(colors.$decrypt-color-bright, 0.24);
      }
    }
  }

  &.fab {
    height: 56px;
    width: 56px;
    border-radius: 28px;

    @include button.raised(true);
    &.green {
      @include button.filled(colors.$theme-color);
    }

    &.red {
      @include button.filled(colors.$decrypt-color);
    }

    & > .icon {
      height: 24px;
      width: 24px;
    }
  }

  &.raised.green {
    @include button.raised;
    @include button.filled(colors.$theme-color);
  }

  &.raised.red {
    @include button.raised;
    @include button.filled(colors.$decrypt-color);
  }

  &.filled.green {
    @include button.filled(colors.$theme-color);
  }

  &.filled.red {
    @include button.filled(colors.$decrypt-color);
  }

  &:not(.icon) > .icon {
    margin-right: 0.5rem;
  }

  &.icon > .icon {
    font-size: 1.5rem;
  }

  & > .icon {
    user-select: none;
    font-size: 1.125rem;
  }

  & > .label {
    text-decoration: none;
    text-transform: uppercase;

    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.01rem;
  }
}
</style>
