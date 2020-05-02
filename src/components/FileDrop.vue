<template>
  <div ref="container" class="file-drop-or-text-container">
    <p class="or-p">or</p>
    <div class="file-drop-container">
      <form
        ref="dropzone"
        action="/"
        class="dropzone-full-screen-overlay"
        :class="{ visible: dropzoneOverlayVisible, gone: dropzoneOverlayGone }"
      >
        <div class="drop-text">
          {{ dropText }}
        </div>
      </form>
      <div class="dropzone-container">
        <div ref="dropFileClickable" class="drop-file-clickable">
          {{ text }}
        </div>
        <div ref="filePreviewContainer" class="file-preview-container">
          <div
            ref="filePreviewTemplate"
            class="preview-template"
            style="display: none;"
          >
            <div class="file-preview">
              <div class="dz-preview dz-file-preview">
                <div class="dz-details">
                  <MDCIconButton class="">close</MDCIconButton>
                  <img data-dz-thumbnail />
                  <div class="dz-filename"><span data-dz-name></span></div>
                  <div class="dz-size" data-dz-size></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import delay from "delay";
import Dropzone from "dropzone";
import MDCIconButton from "./MDCIconButton.vue";
import { Component, Vue, Prop } from "vue-property-decorator";

Dropzone.autoDiscover = false;

@Component({
  components: { MDCIconButton },
})
export default class FileDrop extends Vue {
  @Prop(String) readonly text!: string;
  @Prop(String) readonly dropText!: string;

  $refs!: {
    container: HTMLDivElement;
    dropzone: HTMLFormElement;
    dropFileClickable: HTMLDivElement;
    filePreviewContainer: HTMLDivElement;
    filePreviewTemplate: HTMLDivElement;
  };

  dropzoneOverlayVisible = false;
  dropzoneOverlayGone = true;

  shouldAcceptFiles = true; // TODO: default to false

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
@import "assets/scss/global";

.file-drop-or-text-container {
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 16px;
  box-sizing: border-box;
  overflow: hidden;

  max-height: 100vh;
  will-change: max-height;
  transition-property: max-height;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  &.hide {
    max-height: 0px;
  }

  &.gone {
    display: none;
  }

  .or-p {
    @include secondary-text-auto;
    text-align: center;
  }

  .file-drop-container {
    .dropzone-full-screen-overlay {
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

      opacity: 0;
      background-color: transparent;

      transition-property: opacity, background-color;
      transition-duration: 250ms;
      transition-timing-function: ease-in-out;

      &.gone {
        display: none;
      }

      &.visible {
        opacity: 1;
        background-color: rgba(darken(#43a047, 30%), 0.7);
      }

      .drop-text {
        pointer-events: none;
        font-size: 3rem;
        color: $primary-text-color-dark;
      }
    }

    .dropzone-container {
      background-color: rgba(#000, 0.1);
      border-radius: 16px;
      box-sizing: border-box;

      @media (prefers-color-scheme: dark) {
        background-color: rgba(#fff, 0.1);
      }

      .drop-file-clickable {
        cursor: pointer;
        min-height: 100px;
        text-align: center;
        padding: 16px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        border-radius: 16px;
        border-style: dashed;
        box-sizing: border-box;
        border-color: rgba(#000, 0.2);

        @media (prefers-color-scheme: dark) {
          border-color: rgba(#fff, 0.2);
        }
      }

      .file-preview-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        padding-left: 4px;
        padding-right: 4px;

        .dz-file-preview {
          @include background-auto;

          margin-top: 8px;
          margin-bottom: 8px;
          margin-left: 4px;
          margin-right: 4px;
          width: 100px;
          height: 100px;
          border-radius: 12px;

          .dz-details {
            position: relative;

            height: 100%;
            width: 100%;

            padding: 6px;
            box-sizing: border-box;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            button {
              @include primary-text-auto;
              // @include mdc-icon-button-size(16px);
              // @include mdc-icon-button-icon-size(16px, 16px, 4px);

              position: absolute;
              top: 1px;
              right: 1px;
            }

            img {
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

            .dz-filename {
              @include primary-text-auto;

              width: 100%;

              margin-top: 2px;
            }

            .dz-size {
              @include primary-text-auto;

              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
