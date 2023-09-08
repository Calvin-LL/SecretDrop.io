<script setup lang="ts">
import CardHeader from "@/components/shared/CardHeader.vue";
import CollapseTransition from "@/components/shared/CollapseTransition.vue";
import MessageTextArea from "@/components/shared/MessageTextArea.vue";
import { computed, ref } from "vue";
import DownloadCopyBottonBar from "./DownloadCopyBottonBar/DownloadCopyBottonBar.vue";

const props = withDefaults(
  defineProps<{
    title: string;
    text: string;
    loading: boolean;
    loadingText: string;
    fontSize?: "big" | "small";
  }>(),
  {
    fontSize: "small",
  }
);

const emit = defineEmits<{
  downloadClick: [e: MouseEvent];
  copyClick: [e: MouseEvent];
  enterPressed: [e: KeyboardEvent];
}>();

const root = ref<HTMLDivElement>();
const hidden = computed(() => props.text.length === 0);
</script>

<template>
  <CollapseTransition :element="root" :elementVisible="!hidden">
    <div v-show="!hidden" ref="root" class="result-container">
      <CardHeader :title="title">
        <template #subtitle>
          <slot name="subtitle"></slot>
        </template>
      </CardHeader>

      <MessageTextArea
        :message="text"
        :font-size="fontSize"
        @enter-pressed="emit('enterPressed', $event)"
        disabled
      />

      <DownloadCopyBottonBar
        :loading-text="loadingText"
        :loading="loading"
        @download-click="emit('downloadClick', $event)"
        @copy-click="emit('copyClick', $event)"
      />
    </div>
  </CollapseTransition>
</template>
