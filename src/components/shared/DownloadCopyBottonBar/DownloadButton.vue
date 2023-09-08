<script setup lang="ts">
import Button from "@/components/shared/Button.vue";

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();
</script>

<template>
  <Button
    text-color="secondary"
    icon="save_alt"
    aria-label="Download"
    @click="emit('click', $event)"
  />
</template>
