<template>
  <div class="file-preview">
    <MDCIconButton class="">close</MDCIconButton>
    <img data-dz-thumbnail />
    <div class="dz-filename"><span data-dz-name></span></div>
    <div class="dz-size" data-dz-size></div>
  </div>
</template>

<script lang="ts">
import MDCIconButton from "@/components/MDC/MDCIconButton.vue";
import delay from "delay";
import Dropzone from "dropzone";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: { MDCIconButton },
})
export default class FileDrop extends Vue {
  @Prop(String) readonly text!: string;
  @Prop(String) readonly dropText!: string;
  @Prop(Boolean) readonly shouldAcceptFiles!: boolean;

  $refs!: {
    container: HTMLDivElement;
    dropzone: HTMLFormElement;
    dropFileClickable: HTMLDivElement;
    filePreviewContainer: HTMLDivElement;
    filePreviewTemplate: HTMLDivElement;
  };

  dropzoneOverlayVisible = false;
  dropzoneOverlayGone = true;

  mounted() {
    const dropzone = new Dropzone(this.$refs.dropzone, {
      autoProcessQueue: false,
      previewsContainer: this.$refs.filePreviewContainer,
      previewTemplate: this.$refs.filePreviewTemplate.innerHTML,
      thumbnailMethod: "contain",
      thumbnailWidth: 90,
      thumbnailHeight: 90,
      clickable: this.$refs.dropFileClickable,
      fallback: () => {
        this.$refs.container.remove();
      },
    });

    document.body.addEventListener("dragenter", this.onDragEnterPage);

    dropzone.on("addedfile", this.onDragEnd);
    dropzone.on("drag", this.onDragEnd);
    dropzone.on("dragend", this.onDragEnd);
    dropzone.on("dragleave", this.onDragEnd);
  }

  async onDragEnterPage() {
    if (this.shouldAcceptFiles) {
      this.dropzoneOverlayGone = false;
      await delay(10);
      this.dropzoneOverlayVisible = true;
    }
  }

  async onDragEnd() {
    this.dropzoneOverlayVisible = false;
    await delay(250);
    this.dropzoneOverlayGone = true;
  }
}
</script>

<style scoped lang="scss">
@use "assets/scss/global";

.dz-file-preview {
  @include global.background-auto;

  position: relative;

  margin-top: 8px;
  margin-bottom: 8px;
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

  .close-button {
    @include global.primary-text-auto;
    // @include mdc-icon-button-size(16px);
    // @include mdc-icon-button-icon-size(16px, 16px, 4px);

    position: absolute;
    top: 1px;
    right: 1px;
  }

  .thumbnail {
    flex: 1;
    display: block;
    margin: 0 auto;
    object-fit: contain;
    background-size: contain;

    min-height: 0px;
    min-width: 0px;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
  }

  .filename {
    @include global.primary-text-auto;

    width: 100%;

    margin-top: 2px;
  }

  .file-size {
    @include global.primary-text-auto;

    width: 100%;
  }
}
</style>
