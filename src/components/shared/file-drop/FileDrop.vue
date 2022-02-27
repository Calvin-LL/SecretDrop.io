<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { v4 as uuid } from "uuid";
import { fromEvent } from "file-selector";

import FilePreview from "./FilePreview.vue";

import { FileContainer } from "@/types";
import AnimatedLogo from "@/components/shared/AnimatedLogo.vue";

const props = defineProps<{
  show?: boolean;
  color: "green" | "red";
  text: string;
  dropText: string;
  disabled?: boolean;
  files: FileContainer[];
}>();

const emit = defineEmits<{
  (e: "update:files", files: FileContainer[]): void;
}>();

const showLoadingOverlay = ref(false);
const showDropOverlay = ref(false);

onMounted(() => {
  document.body.addEventListener("dragenter", onFileEnterDocument);
});

onBeforeUnmount(() => {
  document.body.removeEventListener("dragenter", onFileEnterDocument);
});

function onFileEnterDocument() {
  showDropOverlay.value = true;
}

async function addFilesFromEvent(event: Event) {
  const newFiles = await getFilesFromEvent(event);
  const newFileContainers = newFiles.map((file) => ({ id: uuid(), file }));

  emit("update:files", props.files.concat(newFileContainers));
}

function removeFile(file: FileContainer) {
  emit(
    "update:files",
    props.files.filter((f) => f.id !== file.id)
  );
}

async function onDrop(event: Event) {
  showDropOverlay.value = false;

  showLoadingOverlay.value = true;

  await addFilesFromEvent(event);

  showLoadingOverlay.value = false;
}

async function getFilesFromEvent(event: Event) {
  const result = await fromEvent(event);

  return result
    .map((item) => {
      if (item instanceof File) {
        return item;
      } else if (item instanceof DataTransferItem) {
        return item.getAsFile();
      }
    })
    .filter((file): file is File => file !== null);
}
</script>

<template>
  <Transition name="collapse">
    <div v-if="show" class="file-drop-container" v-bind="$attrs">
      <div class="file-drop-clickable-and-preview-container">
        <Transition name="opacity">
          <div v-if="showLoadingOverlay" class="loading-overlay">
            <AnimatedLogo width="50px" animate />
          </div>
        </Transition>

        <label class="file-drop-clickable">
          {{ text }}
          <input type="file" multiple @change="addFilesFromEvent" />
        </label>

        <div
          class="file-preview-container"
          :class="{ 'show-bottom': files.length > 0 }"
        >
          <FilePreview
            v-for="file in files"
            :key="file.id"
            :file="file"
            @remove="removeFile"
          />
        </div>
      </div>
    </div>
  </Transition>

  <Teleport to="body">
    <Transition name="opacity">
      <div
        v-if="showDropOverlay"
        class="file-drop-full-screen-overlay"
        :class="color"
        @dragover.prevent=""
        @dragleave.prevent="showDropOverlay = false"
        @drop.prevent="onDrop"
      >
        <div class="drop-text">
          {{ dropText }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
@use "@/scss/global";
@use "@/scss/colors";

.file-drop-container {
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
  overflow: hidden;

  &.collapse-enter-to,
  &.collapse-leave-from {
    max-height: 100px;
  }

  & > .file-drop-clickable-and-preview-container {
    position: relative;
    overflow: hidden;
    contain: content;

    & > .loading-overlay {
      @include global.flex-center;
      @include global.absolute-overlay;

      border-radius: 16px;
      background-color: rgba(#000000, 0.1);
    }

    & > .file-drop-clickable {
      @include global.flex-center;

      padding: 16px;
      box-sizing: border-box;

      cursor: pointer;
      text-align: center;

      min-height: 100px;

      border-radius: 16px;
      border-style: dashed;
      border-color: rgba(#000, 0.2);

      @media (prefers-color-scheme: dark) {
        border-color: rgba(#fff, 0.2);
      }

      input {
        display: none;
      }
    }

    & > .file-preview-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;

      &.show-bottom {
        padding-bottom: 8px;
      }
    }
  }
}

.file-drop-full-screen-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100000;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.green {
    background-color: rgba(colors.$encrypt-color, 0.4);
  }

  &.red {
    background-color: rgba(colors.$decrypt-color, 0.4);
  }

  & > .drop-text {
    pointer-events: none;
    font-size: 3rem;
    color: colors.$primary-text-color-dark;
  }
}
</style>
