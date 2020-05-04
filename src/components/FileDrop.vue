<template>
  <div
    ref="container"
    class="file-drop-or-text-container"
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

      <div class="file-preview-container"></div>
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
import delay from "delay";
import { fromEvent } from "file-selector";
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: { MDCIconButton, MDCCircularProgress },
})
export default class FileDrop extends Vue {
  $refs!: {
    container: HTMLDivElement;
  };

  @Prop(String) readonly text!: string;
  @Prop(String) readonly dropText!: string;
  @Prop(Boolean) readonly hidden!: boolean;
  @Prop(Boolean) readonly shouldAcceptFiles!: boolean;

  @Model("change", { type: Array }) readonly files!: typeof File[];

  containerInvisible = false;
  containerGone = false;

  fileDropOverlayInvisible = true;
  fileDropOverlayGone = true;

  fileLoadingOverlayInvisible = true;
  fileLoadingOverlayGone = true;

  mounted() {
    document.body.addEventListener("dragenter", this.onDragEnterPage);
  }

  beforeDestroy() {
    document.body.removeEventListener("dragenter", this.onDragEnterPage);
  }

  @Watch("hidden")
  onHiddenChange() {
    this.toggleContainerVisibility(!this.hidden);
  }

  async onDrop(event: DragEvent) {
    this.onDragLeave();

    this.toggleFileLoading(true);

    const files = await fromEvent(event);

    console.log(files);
    this.toggleFileLoading(false);
  }

  async onFileInputChange(event: InputEvent) {
    this.toggleFileLoading(true);

    const files = await fromEvent(event);

    console.log(files);
    this.toggleFileLoading(false);
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
    } else {
      this.$refs.container.style.maxHeight = `${this.$refs.container.clientHeight}px`;
      await delay(10);
      this.containerInvisible = true;
      await delay(250);
      this.containerGone = true;
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
      this.fileLoadingOverlayGone = true;
    }
  }

  async toggleFileDropOverlay(loading: boolean) {
    if (loading) {
      this.fileDropOverlayGone = false;
      await delay(10);
      this.fileDropOverlayInvisible = false;
    } else {
      await delay(10);
      this.fileDropOverlayInvisible = true;
      await delay(250);
      this.fileDropOverlayGone = true;
    }
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.file-drop-or-text-container {
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

  .file-drop-clickable-and-preview-container {
    position: relative;

    background-color: rgba(#000, 0.1);
    border-radius: 16px;
    overflow: hidden;

    @media (prefers-color-scheme: dark) {
      background-color: rgba(#fff, 0.1);
    }

    .loading-overlay {
      @include global.flex-center;
      @include global.absolute-overlay;

      transition-property: opacity;
      transition-duration: 250ms;
      transition-timing-function: ease-in-out;

      opacity: 1;
      background-color: rgba($color: #000000, $alpha: 0.1);

      &.invisible {
        opacity: 0;
      }

      &.gone {
        display: none;
      }
    }

    .file-drop-clickable {
      @include global.flex-center;

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

    .file-preview-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;

      padding-left: 4px;
      padding-right: 4px;
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

    opacity: 1;
    background-color: rgba(darken(#43a047, 30%), 0.7);

    transition-property: opacity;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;

    &.invisible {
      opacity: 0;
    }

    &.gone {
      display: none;
    }

    .drop-text {
      pointer-events: none;
      font-size: 3rem;
      color: global.$primary-text-color-dark;
    }
  }
}
</style>
