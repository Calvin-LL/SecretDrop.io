<template>
  <div id="encrypt">
    <Card
      id="encrypt-card"
      title="Encrypt"
      subtitle="Only the person who has the decryption link can decrypt your message or file. Everything is done on this device. This page also works offline."
      :class="{ error: error.title || error.message }"
    >
      <CardErrorOverlay :title="error.title" :detail="error.message" />
      <ErrorBoundary @errorCaptured="onError">
        <CardLoadingOverlay :hidden="!loadingAnimationVisible">{{
          loadingAnimationText
        }}</CardLoadingOverlay>

        <MessageTextArea
          placeholder="Enter your message here"
          :hidden="hideMessageTextArea"
          :shouldAcceptText="!loadingAnimationVisible && !hideMessageTextArea"
          v-model="message"
        />
        <OrText :hidden="hideOrText" />
        <FileDrop
          text="Drop files here or click here to select files to encrypt"
          dropText="Drop to encrypt"
          :hidden="hideFileDrop"
          :shouldAcceptFiles="!loadingAnimationVisible && !hideFileDrop"
          v-model="files"
        />
        <div class="button-container">
          <MDCButton class="clear-button" text="clear" @click="onClearClick" />
          <MDCButton
            class="encrypt-button"
            text="Encrypt"
            icon="lock"
            type="unelevated"
            @click="onEncryptClick"
          />
        </div>
        <EncryptResultsArea
          title="Encrypted Message"
          subtitle="You may post or send this anywhere. Only the person who has the decryption link can decrypt your message."
          :text="resultText"
          :random-text-length="randomTextLength"
          @animationFinish="onAnimationFinish"
          @download="onDownloadClick"
          @copy="onCopyClick"
        />
        <EncryptFileResultText :hidden="hideFileResultText" />
      </ErrorBoundary>
    </Card>
  </div>
</template>

<script lang="ts">
import EncryptFileResultText from "@/components/Encrypt/EncryptFileResultText.vue";
import EncryptResultsArea from "@/components/Encrypt/EncryptResultsArea.vue";
import MDCButton from "@/components/MDC/MDCButton.vue";
import Card from "@/components/shared/Card.vue";
import CardErrorOverlay from "@/components/shared/CardErrorOverlay.vue";
import CardLoadingOverlay from "@/components/shared/CardLoadingOverlay.vue";
import FileDrop, { FileContainer } from "@/components/shared/FileDrop.vue";
import MessageTextArea from "@/components/shared/MessageTextArea.vue";
import OrText from "@/components/shared/OrText.vue";
import isCryptoUseable from "@/core/CryptoCheck";
import PlainFile from "@/core/PlainFile";
import PlainMessage from "@/core/PlainMessage";
import PublicKey from "@/core/PublicKey";
import CardError from "@/error/CardError";
import { downloadAsTxt } from "@/UIHelpers";
import { getPredictedLengthOfEncryptedString } from "@/UIHelpers";
import { writeText as copy } from "clipboard-polyfill";
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
    EncryptResultsArea,
    EncryptFileResultText,
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
  error: CardError = {};

  hideMessageTextArea = false;
  hideOrText = false;
  hideFileDrop = false;
  hideFileResultText = true;

  message = "";
  files: FileContainer[] = [];

  publicKeyString: string | undefined;
  publicKey: PublicKey | undefined;

  resultText = "";
  randomTextLength = 0;

  created() {
    const parsedHash = new URLSearchParams(this.$route.hash.substr(1));

    this.publicKeyString = parsedHash.get("key") ?? undefined;
  }

  async mounted() {
    if (!isCryptoUseable()) {
      this.error = new CardError("Browser not supported", "");
      return;
    } else if (
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
    this.hideOrText = this.message.length > 0 || this.files.length > 0;
    this.hideFileDrop = this.message.length > 0;
    if (this.message.length === 0) this.resultText = "";
    if (this.files.length === 0) this.hideFileResultText = true;
  }

  @Watch("files")
  onFilesChange() {
    this.hideMessageTextArea = this.files.length > 0;
    this.hideOrText = this.message.length > 0 || this.files.length > 0;
    if (this.message.length === 0) this.resultText = "";
    if (this.files.length === 0) this.hideFileResultText = true;
  }

  onClearClick() {
    this.message = "";
    this.files = [];
  }

  async onEncryptClick(e: Event) {
    if (
      !this.publicKey ||
      this.loadingAnimationVisible ||
      (this.message.length === 0 && this.files.length === 0)
    )
      return;
    (e.target as HTMLButtonElement)?.blur();

    this.loadingAnimationText = "Encrypting";
    this.loadingAnimationVisible = true;

    if (this.message.length > 0) {
      this.resultText = "";
      this.randomTextLength = getPredictedLengthOfEncryptedString(
        this.message.length
      );

      const plainMessage = new PlainMessage(this.message, this.publicKey);

      this.resultText = await plainMessage.encrypt();
      this.randomTextLength = 0;
    } else if (this.files.length > 0) {
      for (const file of this.files) {
        const startTime = Date.now();
        const plainFile = new PlainFile(file.file, this.publicKey);

        await plainFile.encrypt();

        if (Date.now() - startTime < 5000) await delay(3000);

        plainFile.download();
      }

      this.hideFileResultText = false;
      this.loadingAnimationVisible = false;
    }
  }

  onAnimationFinish(textarea: HTMLTextAreaElement) {
    this.loadingAnimationVisible = false;
  }

  onDownloadClick() {
    if (this.resultText.length <= 0 || this.loadingAnimationVisible) return;

    downloadAsTxt(this.resultText, "encrypted-message.txt");
  }

  onCopyClick() {
    if (this.resultText.length <= 0 || this.loadingAnimationVisible) return;

    copy(this.resultText)
      .then(() => this.$root.$emit("show-snackbar", "Copied to clipboard."))
      .catch(() =>
        this.$root.$emit(
          "show-snackbar",
          "Failed to copy to clipboard. Try copying the text manually."
        )
      );
  }

  onError(error: Error) {
    console.error(error);
    if (error.name === "CardError") this.error = error as CardError;
    else this.error = new CardError("Error", error.message);
  }
}
</script>

<style lang="scss">
@use "@material/button";
@use "@material/ripple";
@use "assets/scss/global";

#encrypt {
  flex: 1;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  & > #encrypt-card {
    @include global.encrypt-card-background-auto;

    position: relative;

    &.error {
      & > *:not(.error-overlay) {
        display: none;
      }
    }

    & > .error-overlay {
      @include global.encrypt-card-background-auto;
    }

    .textarea-container > textarea {
      font-size: 1.2rem;
    }

    .file-drop-container > .file-drop-full-screen-overlay {
      background-color: rgba(darken(global.$encrypt-color, 30%), 0.7);
    }

    .button-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;

      & > .encrypt-button {
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

      & > .clear-button {
        @include button.ink-color(global.$theme-color);

        & > .mdc-button__ripple {
          @include ripple.states-base-color(global.$theme-color);
        }
      }
    }

    .result-textarea-container > textarea {
      font-size: 1rem;
    }
  }
}
</style>
