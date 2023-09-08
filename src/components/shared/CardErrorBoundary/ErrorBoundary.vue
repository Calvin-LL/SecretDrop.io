<script setup lang="ts">
import { computed, onErrorCaptured, ref } from "vue";

const props = defineProps<{
  error?: Error;
}>();

const capturedError = ref<Error>();
const error = computed(() => capturedError.value ?? props.error);

onErrorCaptured((err) => {
  capturedError.value = err;
});
</script>

<template>
  <div class="error-broundary">
    <div v-if="error" class="error-overlay-container">
      <slot name="error-overlay" :error="error" />
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/scss/global";
@use "@/scss/transitions";
</style>
