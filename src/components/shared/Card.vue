<script setup lang="ts">
defineProps<{
  color: "green" | "red";
  icon: string;
  iconStyle: "round" | "outlined";
  title: string;
}>();
</script>

<template>
  <div class="card" :class="color">
    <div class="card-title-container">
      <div class="title-container">
        <h2 class="title">{{ title }}</h2>
        <span class="icon" :class="`material-icons-${iconStyle}`">
          {{ icon }}
        </span>
      </div>
      <div class="subtitle">
        <slot name="subtitle"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss">
@use "@/scss/colors";
@use "@/scss/shadows";
@use "@/scss/global";

.card {
  position: relative;

  min-height: 100px;
  max-width: 470px;

  border-radius: 32px;
  overflow: hidden;

  padding: 16px;
  margin-left: 48px;
  margin-right: 48px;

  @media (max-width: 640px) {
    margin-left: 4%;
    margin-right: 4%;
  }

  &.green {
    --card-highlight-color: #{colors.$encrypt-color};

    @include shadows.shadow(24, colors.$encrypt-color-bright);

    background-color: colors.$encrypt-card-background;

    @media (prefers-color-scheme: dark) {
      background-color: colors.$encrypt-card-background-dark;
    }
  }

  &.red {
    --card-highlight-color: #{colors.$decrypt-color};

    @include shadows.shadow(24, colors.$decrypt-color-bright);

    background-color: colors.$decrypt-card-background;

    @media (prefers-color-scheme: dark) {
      background-color: colors.$decrypt-card-background-dark;
    }
  }

  & > .card-title-container {
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
        color: var(--card-highlight-color);
        margin-left: 8px;
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
}
</style>
