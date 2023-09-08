<script setup lang="ts">
import ButtonBar from "@/components/shared/ButtonBar/ButtonBar.vue";
import CopyButton from "./CopyButton.vue";
import DownloadButton from "./DownloadButton.vue";

defineProps<{
  loading?: boolean;
  loadingText?: string;
  static?: boolean;
}>();

const emit = defineEmits<{
  downloadClick: [e: MouseEvent];
  copyClick: [e: MouseEvent];
}>();
</script>

<template>
  <ButtonBar :loading="loading" :loading-text="loadingText" :static="static">
    <DownloadButton @click="emit('downloadClick', $event)" />
    <CopyButton @click="emit('copyClick', $event)" />
  </ButtonBar>
</template>
