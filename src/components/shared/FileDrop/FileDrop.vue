<script setup lang="ts">
import { fromEvent } from "file-selector";
import { v4 as uuid } from "uuid";
import { onBeforeUnmount, onMounted, ref } from "vue";

import FilePreview from "./FilePreview.vue";

import AnimatedLogo from "@/components/shared/AnimatedLogo.vue";
import CollapseTransition from "@/components/shared/CollapseTransition.vue";
import type { FileContainer } from "@/types";

const props = defineProps<{
  color: "green" | "red" | "black";
  text: string;
  dropText: string;
  disabled?: boolean;
  hidden?: boolean;
  files: FileContainer[];
}>();

const emit = defineEmits<{
  (e: "update:files", files: FileContainer[]): void;
}>();

const root = ref<HTMLDivElement>();

const showLoadingOverlay = ref(false);
const showDropOverlay = ref(false);

const isClient = ref(false);

onMounted(() => {
  isClient.value = true;

  document.body.addEventListener("dragenter", onFileEnterDocument);
});

onBeforeUnmount(() => {
  document.body.removeEventListener("dragenter", onFileEnterDocument);
});

function onFileEnterDocument() {
  if (props.disabled) {
    return;
  }
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
  <CollapseTransition :element="root" :elementVisible="!hidden">
    <div
      v-show="!hidden"
      ref="root"
      class="file-drop-container"
      :class="{ disabled }"
    >
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
  </CollapseTransition>

  <Teleport v-if="isClient" to="body">
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

<style lang="scss" scoped>
@use "@/scss/global";
@use "@/scss/colors";
@use "@/scss/transitions";

.file-drop-container {
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 16px;
  box-sizing: border-box;
  overflow: hidden;

  &.disabled {
    pointer-events: none;
  }

  & > .file-drop-clickable-and-preview-container {
    position: relative;
    overflow: hidden;

    & > .loading-overlay {
      @include global.flex-center;
      @include global.absolute-overlay;

      border-radius: 16px;
      background-color: rgba(#000000, 0.1);
    }

    & > .file-drop-clickable {
      @include global.flex-center;

      position: relative;

      padding: 16px;
      box-sizing: border-box;

      cursor: pointer;
      text-align: center;

      min-height: 100px;

      border-width: 3px;
      border-radius: 16px;
      border-style: dashed;
      border-color: rgba(#000, 0.2);

      transition-property: background, border;
      transition-duration: transitions.$transition-duration-tiny;
      transition-timing-function: transitions.$transition-timing-function-standard;

      @media (prefers-color-scheme: dark) {
        border-color: rgba(#fff, 0.2);
      }

      @media (hover: hover) {
        &:hover {
          border-color: rgba(#000, 0.4);
          background-color: rgba(#000, 0.1);

          @media (prefers-color-scheme: dark) {
            border-color: rgba(#fff, 0.4);
            background-color: rgba(#fff, 0.1);
          }
        }
      }

      &:focus-within {
        border-color: #000;
        background-color: rgba(#000, 0.1);

        @media (prefers-color-scheme: dark) {
          border-color: #fff;
          background-color: rgba(#fff, 0.1);
        }
      }

      &:active {
        border-color: rgba(#000, 0.6);
        background-color: rgba(#000, 0.2);

        @media (prefers-color-scheme: dark) {
          border-color: rgba(#fff, 0.6);
          background-color: rgba(#fff, 0.2);
        }
      }

      input {
        position: absolute;
        opacity: 0;
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

  &.black {
    background-color: rgba(#000, 0.4);
  }

  & > .drop-text {
    pointer-events: none;
    font-size: 3rem;
    color: colors.$primary-text-color-dark;
  }
}
</style>
