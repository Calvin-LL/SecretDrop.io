<template>
  <div class="encrypt">
    <Card
      class="encrypt-card"
      title="Encrypt"
      subtitle="Only the person who has the decryption link can decrypt your message or file. Everything is done on this device. This page also works offline."
    >
      <div
        ref="textareaContainer"
        class="textarea-container"
        :class="{
          invisible: textareaContainerInvisible,
          gone: textareaContainerGone,
        }"
      >
        <textarea
          autofocus
          placeholder="Enter your message here"
          v-model="message"
        ></textarea>
      </div>
      <p class="or-p" :class="{ invisible: orTextInvisible, gone: orTextGone }">
        or
      </p>
      <FileDrop
        text="Drop files here or click here to select files to encrypt"
        dropText="Drop to encrypt"
        :hidden="hideFileDrop"
        :shouldAcceptFiles="loadingKeyAnimationFinish"
        v-model="files"
      />
    </Card>
  </div>
</template>

<script lang="ts">
import Card from "@/components/Card.vue";
import delay from "delay";
import FileDrop from "@/components/FileDrop.vue";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: { Card, FileDrop },
})
export default class Encrypt extends Vue {
  $refs!: {
    textareaContainer: HTMLDivElement;
  };

  loadingKeyAnimationFinish = true;

  textareaContainerInvisible = false;
  textareaContainerGone = false;

  orTextInvisible = false;
  orTextGone = false;

  hideFileDrop = false;

  message: string = "";
  files: typeof File[] = [];

  @Watch("message")
  onMessageChange() {
    this.hideFileDrop = this.message.length > 0;
    this.toggleOrTextVisibility(
      this.message.length === 0 && this.files.length === 0
    );
  }

  @Watch("files")
  onFilesChange() {
    this.toggleTextareaContainerVisibility(this.files.length > 0);
    this.toggleOrTextVisibility(
      this.message.length === 0 && this.files.length === 0
    );
  }

  async toggleTextareaContainerVisibility(loading: boolean) {
    if (loading) {
      this.textareaContainerGone = false;
      await delay(10);
      this.textareaContainerInvisible = false;
    } else {
      this.$refs.textareaContainer.style.maxHeight = `${this.$refs.textareaContainer.clientHeight}px`;
      await delay(10);
      this.textareaContainerInvisible = true;
      await delay(250);
      this.textareaContainerGone = true;
    }
  }

  async toggleOrTextVisibility(loading: boolean) {
    if (loading) {
      this.orTextGone = false;
      await delay(10);
      this.orTextInvisible = false;
    } else {
      await delay(10);
      this.orTextInvisible = true;
      await delay(250);
      this.orTextGone = true;
    }
  }
}
</script>

<style scoped lang="scss">
@use "assets/scss/global";

.encrypt {
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .encrypt-card {
    @include global.encrypt-card-background-auto;

    .textarea-container {
      padding-left: 8px;
      padding-right: 8px;
      padding-bottom: 8px;

      transition-property: max-height, padding-bottom;
      transition-duration: 250ms;
      transition-timing-function: ease-in-out;

      &.invisible {
        max-height: 0px !important;
        padding-bottom: 0px;
      }

      &.gone {
        display: none;
      }

      textarea {
        @include global.primary-text-auto;

        width: 100%;
        height: 100px;

        resize: none;
        border: none;
        outline: none;
        overflow-y: hidden;

        padding: 0px;

        background-color: transparent;

        font-size: 1.2rem;
        font-family: Roboto Slab, serif;

        &::placeholder {
          @include global.secondary-text-auto;
        }
      }
    }

    .or-p {
      @include global.secondary-text-auto;
      text-align: center;
      font-size: 1rem;
      line-height: 1rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
      max-height: 2rem;

      overflow: hidden;

      transition-property: max-height, margin;
      transition-duration: 250ms;
      transition-timing-function: ease-in-out;

      &.invisible {
        max-height: 0px;
        margin: 0px;
      }

      &.gone {
        display: none;
      }
    }
  }
}
</style>
