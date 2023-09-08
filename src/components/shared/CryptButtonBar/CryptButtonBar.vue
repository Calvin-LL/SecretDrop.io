<script setup lang="ts">
import ButtonBar from "@/components/shared/ButtonBar/ButtonBar.vue";
import ClearButton from "./ClearButton.vue";
import CryptButton from "./CryptButton.vue";

const props = defineProps<{
  type: "encrypt" | "decrypt";
  loading?: boolean;
  loadingText?: string;
  static?: boolean;
}>();

const emit = defineEmits<{
  cryptClick: [e: MouseEvent];
  clearClick: [e: MouseEvent];
}>();

const clearButtonColor = props.type === "encrypt" ? "green" : "red";
</script>

<template>
  <ButtonBar :loading="loading" :loading-text="loadingText" :static="static">
    <ClearButton
      :color="clearButtonColor"
      @click="emit('clearClick', $event)"
    />
    <CryptButton :type="type" @click="emit('cryptClick', $event)" />
  </ButtonBar>
</template>
