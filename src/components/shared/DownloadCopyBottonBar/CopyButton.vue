<script setup lang="ts">
import Button from "@/components/shared/Button.vue";

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();
</script>

<template>
  <Button
    text-color="secondary"
    icon="file_copy"
    icon-style="outlined"
    aria-label="Copy to clipboard"
    @click="emit('click', $event)"
  />
</template>
