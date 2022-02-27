<script setup lang="ts">
defineProps<{
  color?: "green" | "red";
  icon?: string;
  iconStyle?: "round" | "outlined";
  title: string;
}>();
</script>

<template>
  <div class="card-header-container">
    <div class="title-container">
      <h2 class="title">{{ title }}</h2>
      <span
        v-if="icon"
        class="icon"
        :class="[`material-icons-${iconStyle}`, color]"
      >
        {{ icon }}
      </span>
    </div>
    <div class="subtitle">
      <slot name="subtitle"></slot>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/scss/colors";
@use "@/scss/global";

.card-header-container {
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  margin-bottom: 16px;
  padding-left: 8px;
  padding-right: 8px;
  contain: content;

  & > .title-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;

    margin-bottom: 4px;

    & > .title {
      font-weight: 500;
      margin: 0px;
    }

    & > .icon {
      margin-left: 8px;

      &.green {
        color: colors.$encrypt-color;
      }

      &.red {
        color: colors.$decrypt-color;
      }
    }
  }

  & > .subtitle {
    @include global.secondary-text-auto;

    span.warning {
      color: colors.$warning-color;

      @media (prefers-color-scheme: dark) {
        color: colors.$warning-color-dark;
      }
    }
  }
}
</style>
