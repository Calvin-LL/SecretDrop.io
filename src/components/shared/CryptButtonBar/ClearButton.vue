<script setup lang="ts">
import Button from "@/components/shared/Button.vue";

defineProps<{
  color?: "green" | "red";
}>();

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();
</script>

<template>
  <Button
    :color="color"
    text="clear"
    text-color="vivid"
    tinted-background
    @click="emit('click', $event)"
  />
</template>
