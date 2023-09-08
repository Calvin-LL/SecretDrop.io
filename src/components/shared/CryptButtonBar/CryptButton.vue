<script setup lang="ts">
import Button from "@/components/shared/Button.vue";

defineProps<{
  type: "encrypt" | "decrypt";
}>();

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();
</script>

<template>
  <Button
    :text="type"
    :icon="type === 'encrypt' ? 'lock' : 'lock_open'"
    :color="type === 'encrypt' ? 'green' : 'red'"
    icon-style="outlined"
    button-style="filled"
    @click="emit('click', $event)"
  />
</template>
