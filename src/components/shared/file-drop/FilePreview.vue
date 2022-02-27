<script setup lang="ts">
import { computed } from "vue";
import mime from "mime";
import getFileSizeString from "filesize.js";
import availabelIcons from "file-icon-vectors/dist/icons/vivid/catalog.json";

import Button from "../Button.vue";

import { FileContainer } from "@/types";

const props = defineProps<{
  file: FileContainer;
}>();
const iconFileExtention = computed(() => {
  const fileExtention = mime.getExtension(props.file.file.type);

  return fileExtention && availabelIcons.includes(fileExtention)
    ? fileExtention
    : "blank";
});
const fileSizeString = computed(() =>
  getFileSizeString(props.file.file.size, 0, "si").toUpperCase()
);

const emit = defineEmits<{
  (e: "remove", file: FileContainer): void;
}>();

function removeFile() {
  emit("remove", props.file);
}
</script>

<template>
  <div class="file-preview">
    <div class="info">
      <span
        class="file-icon fiv-viv fiv-size-lg"
        :class="`fiv-icon-${iconFileExtention}`"
      />
      <div class="text">
        <div class="filename">{{ file.file.name }}</div>
        <div class="size">{{ fileSizeString }}</div>
      </div>
    </div>

    <Button text-color="secondary" icon="close" @click="removeFile" />
  </div>
</template>

<style lang="scss">
@use "file-icon-vectors/dist/file-icon-vivid.min.css";
@use "@/scss/global";

.file-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 8px;

  padding: 8px;

  border-radius: 16px;

  background-color: rgba(#000, 0.1);

  @media (prefers-color-scheme: dark) {
    background-color: rgba(#fff, 0.1);
  }

  & > .info {
    display: flex;
    align-items: center;

    & > .file-icon {
      height: 2.5rem;
      margin-right: 8px;
    }

    & > .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      line-break: anywhere;

      & > .filename {
        @include global.primary-text-auto;
      }
      & > .size {
        @include global.secondary-text-auto;

        margin-top: 4px;
      }
    }
  }
}
</style>
