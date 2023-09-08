<script setup lang="ts">
import AnimatedSafe from "@/components/shared/AnimatedSafe.vue";
import StaticButtonBar from "./StaticButtonBar.vue";

defineProps<{
  loading?: boolean;
  loadingText?: string;
}>();
</script>

<template>
  <div class="bottom-bar-container">
    <Transition name="opacity">
      <div v-if="loading" class="loading-bar">
        <AnimatedSafe class="animated-safe" width="36px" />
        <div class="label">{{ loadingText }}</div>
      </div>
      <StaticButtonBar v-else>
        <slot />
      </StaticButtonBar>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use "@/scss/global";
@use "@/scss/transitions";

.bottom-bar-container {
  position: relative;

  width: 100%;
  height: 48px;

  & > .loading-bar {
    @include global.absolute-overlay;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    & > .animated-safe {
      margin-left: 8px;
      margin-right: 16px;
    }

    & > .label {
      @include global.secondary-text-auto;

      font-size: 1.1rem;
      font-weight: 400;
    }
  }
}
</style>
