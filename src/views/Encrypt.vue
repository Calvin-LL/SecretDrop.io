<template>
  <div class="encrypt">
    <Card
      class="encrypt-card"
      title="Encrypt"
      subtitle="Only the person who has the decryption link can decrypt your message or file. Everything is done on this device. This page also works offline."
    >
      <CardErrorOverlay :title="error.title" :detail="error.message" />
      <ErrorBoundary @errorCaptured="onError">
        <MessageTextArea :hidden="hideMessageTextArea" v-model="message" />
        <OrText :hidden="hideOrText" />
        <FileDrop
          text="Drop files here or click here to select files to encrypt"
          dropText="Drop to encrypt"
          :hidden="hideFileDrop"
          :shouldAcceptFiles="loadingKeyAnimationFinish"
          v-model="files"
        />
        <div class="encrypt-button-container">
          <MDCButton
            class="encrypt-button"
            text="Encrypt"
            icon="lock"
            type="unelevated"
            @click="onEncryptClick"
          />
        </div>
      </ErrorBoundary>
    </Card>
  </div>
</template>

<script lang="ts">
import Card from "@/components/Card.vue";
import CardErrorOverlay from "@/components/CardErrorOverlay.vue";
import FileDrop, { FileContainer } from "@/components/FileDrop.vue";
import MDCButton from "@/components/MDC/MDCButton.vue";
import MessageTextArea from "@/components/MessageTextArea.vue";
import OrText from "@/components/OrText.vue";
import CardError from "@/error/CardError";
import delay from "delay";
// @ts-ignore
import { ErrorBoundary } from "vue-error-boundary";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    Card,
    MessageTextArea,
    OrText,
    FileDrop,
    MDCButton,
    ErrorBoundary,
    CardErrorOverlay,
  },
})
export default class Encrypt extends Vue {
  $refs!: {
    textareaContainer: HTMLDivElement;
  };

  loadingKeyAnimationFinish = true;

  // @ts-ignore
  error: CardError = new CardError(undefined, undefined);

  hideMessageTextArea = false;
  hideOrText = false;
  hideFileDrop = false;

  message: string = "";
  files: FileContainer[] = [];

  @Watch("message")
  onMessageChange() {
    this.hideFileDrop = this.message.length > 0;
    this.hideOrText = this.message.length > 0 || this.files.length > 0;
  }

  @Watch("files")
  onFilesChange() {
    this.hideMessageTextArea = this.files.length > 0;
    this.hideOrText = this.message.length > 0 || this.files.length > 0;
  }

  onEncryptClick() {}

  onError(error: Error) {
    if (error.name === "CardError") this.error = error as CardError;
    else this.error = new CardError("Error", error.message);
  }
}
</script>

<style lang="scss">
@use "@material/button";
@use "assets/scss/global";

.encrypt {
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .encrypt-card {
    @include global.encrypt-card-background-auto;

    position: relative;

    .error-overlay {
      @include global.encrypt-card-background-auto;
    }

    .textarea-container {
      textarea {
        font-size: 1.2rem;
      }
    }

    .encrypt-button-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      .encrypt-button {
        @include button.container-fill-color(global.$theme-color);
        @include button.ink-color(global.$primary-text-color-dark);
        @include button.icon-color(global.$primary-text-color-dark);

        @include button.disabled-container-fill-color(
          rgba(global.$theme-color, 0.3)
        );
        @include button.disabled-ink-color(global.$disabled-text-color-dark);
        @include button.disabled-icon-color(global.$disabled-text-color-dark);

        margin: 8px;
      }
    }
  }
}
</style>
