<script setup lang="ts">
import CardHeader from "./CardHeader.vue";
defineProps<{
  color: "green" | "red";
  icon: string;
  iconStyle: "round" | "outlined";
  title: string;
}>();
</script>

<template>
  <div class="card" :class="color">
    <CardHeader
      :color="color"
      :icon="icon"
      :icon-style="iconStyle"
      :title="title"
    >
      <template #subtitle>
        <slot name="subtitle"></slot>
      </template>
    </CardHeader>
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
    @include shadows.shadow(24, colors.$encrypt-color-bright);

    background-color: colors.$encrypt-card-background;

    @media (prefers-color-scheme: dark) {
      @include shadows.shadow(24, colors.$encrypt-color-bright-dark);

      background-color: colors.$encrypt-card-background-dark;
    }

    & > .card-title-container > .title-container > .icon {
      color: colors.$encrypt-color;
    }
  }

  &.red {
    @include shadows.shadow(24, colors.$decrypt-color-bright);

    background-color: colors.$decrypt-card-background;

    @media (prefers-color-scheme: dark) {
      @include shadows.shadow(24, colors.$decrypt-color-bright-dark);

      background-color: colors.$decrypt-card-background-dark;
    }

    & > .card-title-container > .title-container > .icon {
      color: colors.$decrypt-color;
    }
  }
}
</style>
