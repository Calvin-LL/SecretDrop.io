<script setup lang="ts">
import LoadingButtonBar from "./LoadingButtonBar.vue";
import StaticButtonBar from "./StaticButtonBar.vue";

defineProps<{
  loading?: boolean;
  loadingText?: string;
  static?: boolean;
}>();
</script>

<template>
  <StaticButtonBar v-if="static">
    <slot />
  </StaticButtonBar>
  <LoadingButtonBar :loading="loading" :loading-text="loadingText" v-else>
    <slot />
  </LoadingButtonBar>
</template>
