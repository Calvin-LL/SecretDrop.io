<template>
  <div class="encrypt">
    <Card
      class="encrypt-card"
      title="Encrypt"
      subtitle="Only the person who has the decryption link can decrypt your message or file. Everything is done on this device. This page also works offline."
    >
      <CardErrorOverlay :title="error.title" :detail="error.message" />
      <ErrorBoundary @errorCaptured="onError">
        <CardLoadingOverlay :hidden="!loadingAnimationVisible">{{
          loadingAnimationText
        }}</CardLoadingOverlay>
        <MessageTextArea
          :hidden="hideMessageTextArea"
          :shouldAcceptText="!loadingAnimationVisible"
          v-model="message"
        />
        <OrText :hidden="hideOrText" />
        <FileDrop
          text="Drop files here or click here to select files to encrypt"
          dropText="Drop to encrypt"
          :hidden="hideFileDrop"
          :shouldAcceptFiles="!loadingAnimationVisible"
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
import CardLoadingOverlay from "@/components/CardLoadingOverlay.vue";
import FileDrop, { FileContainer } from "@/components/FileDrop.vue";
import MDCButton from "@/components/MDC/MDCButton.vue";
import MessageTextArea from "@/components/MessageTextArea.vue";
import OrText from "@/components/OrText.vue";
import isCryptoUseable from "@/core/CryptoCheck";
import PublicKey from "@/core/PublicKey";
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
    CardLoadingOverlay,
  },
})
export default class Encrypt extends Vue {
  $refs!: {
    textareaContainer: HTMLDivElement;
  };

  loadingAnimationVisible = true;
  loadingAnimationText = "Loading Key";

  // @ts-ignore
  error: CardError = new CardError(undefined, undefined);

  hideMessageTextArea = false;
  hideOrText = false;
  hideFileDrop = false;

  message: string = "";
  files: FileContainer[] = [];

  publicKeyString: string | undefined;
  publicKey: PublicKey | undefined;

  created() {
    this.publicKeyString = this.$route.query.key as string;
  }

  async mounted() {
    if (!isCryptoUseable()) {
      this.error = new CardError("Browser not supported", "");
      return;
    }

    if (
      !this.publicKeyString ||
      this.publicKeyString.length <= 0 ||
      this.publicKeyString.match(/[^a-z0-9]/g) !== null
    ) {
      this.error = new CardError("Invalid Link", "");
      return;
    }

    this.publicKey = new PublicKey(this.publicKeyString);

    await delay(3000);
    this.loadingAnimationVisible = false;
  }

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

  async onEncryptClick() {
    this.loadingAnimationText = "Encrypting";
    this.loadingAnimationVisible = true;

    //

    this.loadingAnimationVisible = false;
  }

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
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

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
