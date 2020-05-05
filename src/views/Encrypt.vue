<template>
  <ErrorBoundary @errorCaptured="onError">
    <div class="encrypt">
      <Card
        class="encrypt-card"
        title="Encrypt"
        subtitle="Only the person who has the decryption link can decrypt your message or file. Everything is done on this device. This page also works offline."
      >
        <CardErrorOverlay :title="error.title" :detail="error.message" />
        <MessageTextArea :hidden="hideMessageTextArea" v-model="message" />
        <OrText :hidden="hideOrText" />
        <FileDrop
          text="Drop files here or click here to select files to encrypt"
          dropText="Drop to encrypt"
          :hidden="hideFileDrop"
          :shouldAcceptFiles="loadingKeyAnimationFinish"
          v-model="files"
        />
      </Card>
    </div>
  </ErrorBoundary>
</template>

<script lang="ts">
import Card from "@/components/Card.vue";
import CardErrorOverlay from "@/components/CardErrorOverlay.vue";
import FileDrop, { FileContainer } from "@/components/FileDrop.vue";
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

  onError(error: Error) {
    if (error.name === "CardError") this.error = error as CardError;
    else this.error = new CardError("Error", error.message);
  }
}
</script>

<style lang="scss">
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
  }
}
</style>
