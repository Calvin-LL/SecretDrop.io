<template>
  <div
    ref="container"
    class="file-drop-container"
    :class="{
      invisible: containerInvisible,
      gone: containerGone,
    }"
  >
    <div class="file-drop-clickable-and-preview-container">
      <div
        class="loading-overlay"
        :class="{
          invisible: fileLoadingOverlayInvisible,
          gone: fileLoadingOverlayGone,
        }"
      >
        <MDCCircularProgress />
      </div>

      <label class="file-drop-clickable">
        {{ text }}
        <input type="file" @change="onFileInputChange" multiple />
      </label>

      <div
        ref="filePreviewContainer"
        class="file-preview-container"
        :class="{ 'show-bottom': files.length > 0 }"
      >
        <FilePreview
          v-for="file in files"
          :key="file.id"
          :file="file"
          :style="{ width: `${previewSize}px`, height: `${previewSize}px` }"
          @remove="onRemove"
        />
      </div>
    </div>

    <div
      class="file-drop-full-screen-overlay"
      :class="{
        invisible: fileDropOverlayInvisible,
        gone: fileDropOverlayGone,
      }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div class="drop-text">
        {{ dropText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MDCCircularProgress from "@/components/MDC/MDCCircularProgress.vue";
import MDCIconButton from "@/components/MDC/MDCIconButton.vue";
import FilePreview from "@/components/shared/FilePreview.vue";
import CardError from "@/error/CardError";
import delay from "delay";
import { fromEvent } from "file-selector";
import FileType from "file-type/browser";
import mime from "mime";
import uuid from "uuid-random";
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

export interface FileContainer {
  id: string;
  name: string;
  extension?: string;
  type?: string;
  size?: number;
  file: File;
}

@Component({
  components: { MDCIconButton, MDCCircularProgress, FilePreview },
})
export default class FileDrop extends Vue {
  $refs!: {
    container: HTMLDivElement;
    filePreviewContainer: HTMLDivElement;
  };

  @Prop(String) readonly text!: string;
  @Prop(String) readonly dropText!: string;
  @Prop(Boolean) readonly hidden!: boolean;
  @Prop(Boolean) readonly shouldAcceptFiles!: boolean;

  @Model("change", { type: Array }) readonly files!: FileContainer[];

  containerInvisible = false;
  containerGone = false;

  fileDropOverlayInvisible = true;
  fileDropOverlayGone = true;

  fileLoadingOverlayInvisible = true;
  fileLoadingOverlayGone = true;

  previewSize = 100;

  resizeObserver: ResizeObserver | undefined;

  mounted() {
    document.body.addEventListener("dragenter", this.onDragEnterPage);

    if (window.ResizeObserver !== undefined) {
      this.resizeObserver = new ResizeObserver((entries) => {
        this.previewSize = this.calculatePreviewSize(
          entries[0].contentRect.width
        );
      });

      this.resizeObserver.observe(this.$refs.filePreviewContainer);
    } else if (window.getComputedStyle !== undefined) {
      this.previewSize = this.calculatePreviewSize(
        Number.parseInt(getComputedStyle(this.$refs.filePreviewContainer).width)
      );
    }
  }

  beforeDestroy() {
    document.body.removeEventListener("dragenter", this.onDragEnterPage);
    this.resizeObserver?.disconnect();
  }

  @Watch("hidden")
  onHiddenChange() {
    this.toggleContainerVisibility(!this.hidden);
  }

  async onDrop(event: DragEvent) {
    this.onDragLeave();

    this.toggleFileLoading(true);

    const files = await this.getFilesFromEvent(event);

    await this.addFiles(files);

    this.toggleFileLoading(false);
  }

  async onFileInputChange(event: InputEvent) {
    this.toggleFileLoading(true);

    const files = await this.getFilesFromEvent(event);

    await this.addFiles(files);

    this.toggleFileLoading(false);

    (event.target as HTMLInputElement).value = "";
  }

  async getFilesFromEvent(event: Event): Promise<File[]> {
    const result = await fromEvent(event);

    // @ts-ignore
    if ((result[0] as DataTransferItem)?.getAsFile)
      return (result as DataTransferItem[]).map((item) =>
        item.getAsFile()
      ) as File[];

    // @ts-ignore
    if ((result[0] as DataTransferItem)?.webkitGetAsEntry)
      throw new CardError("File format not supported", "Refresh to try again");

    return result as File[];
  }

  async addFiles(filesToAdd: File[]) {
    for (const file of filesToAdd) {
      const fileContainerToAdd: FileContainer = {
        id: uuid(),
        name: file.name,
        extension: undefined,
        // @ts-ignore
        type: file.type,
        // @ts-ignore
        size: file.size,
        file,
      };

      if (!fileContainerToAdd.type) {
        const fileTypeResult = await FileType.fromBlob(file);

        if (fileTypeResult) {
          fileContainerToAdd.extension = fileTypeResult.ext;
          fileContainerToAdd.type = fileTypeResult.mime;

          if (!fileContainerToAdd.name)
            fileContainerToAdd.name = `file.${fileTypeResult.ext}`;
        }
      }

      if (!fileContainerToAdd.extension) {
        const afterDot = fileContainerToAdd.name.split(".").pop();
        if (afterDot) fileContainerToAdd.extension = afterDot;
      }

      if (!fileContainerToAdd.extension) {
        if (fileContainerToAdd.type) {
          const extension = mime.getExtension(fileContainerToAdd.type);
          if (extension) fileContainerToAdd.extension = extension;
        }
      }

      if (!fileContainerToAdd.name) {
        if (fileContainerToAdd.type)
          fileContainerToAdd.name = `file.${mime.getExtension(
            fileContainerToAdd.type
          )}`;
        else fileContainerToAdd.name = "file";
      }

      this.files.push(fileContainerToAdd);
    }
  }

  onRemove(fileToRemove: FileContainer) {
    const newFiles = this.files.filter((item) => item.id !== fileToRemove.id);
    this.$emit("change", newFiles);
  }

  onDragEnterPage() {
    if (this.shouldAcceptFiles) this.toggleFileDropOverlay(true);
  }

  onDragOver() {}

  onDragLeave() {
    this.toggleFileDropOverlay(false);
  }

  async toggleContainerVisibility(visible: boolean) {
    if (visible) {
      this.containerGone = false;
      await delay(10);
      this.containerInvisible = false;
      await delay(250);
      if (!this.containerInvisible) this.$refs.container.style.maxHeight = "";
    } else {
      this.$refs.container.style.maxHeight = `${this.$refs.container.clientHeight}px`;
      await delay(10);
      this.containerInvisible = true;
      await delay(250);
      if (this.containerInvisible) this.containerGone = true;
    }
  }

  async toggleFileLoading(loading: boolean) {
    if (loading) {
      this.fileLoadingOverlayGone = false;
      await delay(10);
      this.fileLoadingOverlayInvisible = false;
    } else {
      await delay(10);
      this.fileLoadingOverlayInvisible = true;
      await delay(250);
      if (this.fileLoadingOverlayInvisible) this.fileLoadingOverlayGone = true;
    }
  }

  async toggleFileDropOverlay(visible: boolean) {
    if (visible) {
      this.fileDropOverlayGone = false;
      await delay(10);
      this.fileDropOverlayInvisible = false;
    } else {
      await delay(10);
      this.fileDropOverlayInvisible = true;
      await delay(250);
      if (this.fileDropOverlayInvisible) this.fileDropOverlayGone = true;
    }
  }

  calculatePreviewSize(parentWidth: number) {
    const bestSoFar = { remainder: Number.MAX_VALUE, width: 100 };

    for (let i = 90; i <= 150; i++) {
      const totalWidth = i + 20;
      if (parentWidth % totalWidth <= bestSoFar.remainder) {
        bestSoFar.remainder = parentWidth % totalWidth;
        bestSoFar.width = i;
      }
    }

    return bestSoFar.width;
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.file-drop-container {
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
  overflow: hidden;

  transition-property: max-height;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  &.invisible {
    max-height: 0px !important;
  }

  &.gone {
    display: none;
  }

  & > .file-drop-clickable-and-preview-container {
    position: relative;

    background-color: rgba(#000, 0.1);
    border-radius: 16px;
    overflow: hidden;

    @media (prefers-color-scheme: dark) {
      background-color: rgba(#fff, 0.1);
    }

    & > .loading-overlay {
      @include global.flex-center;
      @include global.absolute-overlay;

      transition-property: opacity;
      transition-duration: 250ms;
      transition-timing-function: ease-in-out;

      border-radius: 16px;
      opacity: 1;
      background-color: rgba($color: #000000, $alpha: 0.1);

      &.invisible {
        opacity: 0;
      }

      &.gone {
        display: none;
      }
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
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;

      padding-left: 5px;
      padding-right: 5px;

      &.show-bottom {
        padding-bottom: 9px;
      }
    }
  }

  & > .file-drop-full-screen-overlay {
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

    opacity: 1;

    transition-property: opacity;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;

    &.invisible {
      opacity: 0;
    }

    &.gone {
      display: none;
    }

    & > .drop-text {
      pointer-events: none;
      font-size: 3rem;
      color: global.$primary-text-color-dark;
    }
  }
}
</style>
