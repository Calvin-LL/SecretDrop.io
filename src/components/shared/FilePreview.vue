<template>
  <div ref="container" class="file-preview">
    <MDCIconButton class="close-button" @click="onRemoveClick"
      >close</MDCIconButton
    >
    <span
      class="file-icon fiv-viv fiv-size-lg"
      :class="`fiv-icon-${fileExt}`"
      v-if="!previewImgSrc"
    ></span>
    <img class="thumbnail" :src="previewImgSrc" v-if="previewImgSrc" />
    <div class="text filename">{{ file.name }}</div>
    <div class="text size" v-if="fileSize">{{ fileSize }}</div>
  </div>
</template>

<script lang="ts">
import MDCIconButton from "@/components/MDC/MDCIconButton.vue";
import { FileContainer } from "@/components/shared/FileDrop.vue";
import availabelIcons from "file-icon-vectors/dist/icons/vivid/catalog.json";
// @ts-ignore
import FileUploadThumbnail from "file-upload-thumbnail";
import getFileSizeString from "filesize.js";
import Vue from "vue";

export default Vue.extend({
  name: "FilePreview",
  components: { MDCIconButton },
  props: {
    file: Object,
  },
  computed: {
    fileExt() {
      if (this.file.extension && availabelIcons.includes(this.file.extension))
        return this.file.extension;
      else return "blank";
    },
    fileSize() {
      if (this.file.size)
        return getFileSizeString(this.file.size, 0, "si").toUpperCase();
      else return undefined;
    },
  },
  asyncComputed: {
    previewImgSrc() {
      return new Promise((resolve) => {
        new FileUploadThumbnail({
          maxWidth: 120,
          maxHeight: 120,
          file: this.file.file,
          onSuccess: function (src: string) {
            if (src && src.length > 0) resolve(src);
            else resolve(undefined);
          },
        }).createThumbnail();
      });
    },
  },
  methods: {
    onRemoveClick() {
      this.$emit("remove", this.file);
    },
  },
});
</script>

<style lang="scss">
@use "@material/icon-button";
@use "assets/scss/global";

.file-preview {
  @include global.background-auto;

  position: relative;
  contain: content;

  margin-top: 8px;
  margin-left: 4px;
  margin-right: 4px;

  padding: 6px;

  width: 100px;
  height: 100px;

  border-radius: 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > .close-button {
    @include global.primary-text-auto;
    @include icon-button.size(16px);
    @include icon-button.icon-size(16px, 16px, 4px);

    position: absolute;
    top: 1px;
    right: 1px;
  }

  & > .file-icon {
    flex: 1;
    overflow: hidden;
  }

  & > .thumbnail {
    flex: 1;
    display: block;
    margin: 0 auto;
    object-fit: contain;
    background-size: contain;
    min-height: 0;
    min-width: 0;
    max-width: 100%;
  }

  & > .text {
    @include global.primary-text-auto;

    width: 100%;

    white-space: nowrap;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;

    &.filename {
      margin-top: 2px;
    }

    &.file-size {
    }
  }
}
</style>
