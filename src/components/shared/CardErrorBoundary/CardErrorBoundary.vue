<script setup lang="ts">
import CardError from "@/CardError";
import ErrorBoundary from "./ErrorBoundary.vue";
import ErrorOverlay from "./ErrorOverlay.vue";

defineProps<{
  error?: Error;
}>();
</script>

<template>
  <ErrorBoundary :error="error">
    <template #default>
      <slot />
    </template>

    <template #error-overlay="{ error }">
      <ErrorOverlay
        v-if="error instanceof CardError"
        :title="error.title"
        :detail="error.message"
      />
      <ErrorOverlay
        v-else
        title="Something went wrong"
        :detail="error.message"
      />
    </template>
  </ErrorBoundary>
</template>
