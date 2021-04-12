<template>
  <div id="decrypt">
    <Card
      id="decrypt-card"
      title="Decrypt"
      :class="{ error: error.title || error.message }"
    >
      <CardErrorOverlay :title="error.title" :detail="error.message" />
      <ErrorBoundary @errorCaptured="onError">
        <CardLoadingOverlay :hidden="!loadingAnimationVisible">{{
          loadingAnimationText
        }}</CardLoadingOverlay>

        <MessageTextArea
          placeholder="Paste the encrypted message here"
          :hidden="hideMessageTextArea"
          :shouldAcceptText="!loadingAnimationVisible && !hideMessageTextArea"
          v-model="message"
        />
        <OrText :hidden="hideOrText" />
        <FileDrop
          text="Drop encrypted files here or click here to select encrypted files to decrypt"
          dropText="Drop to decrypt"
          :hidden="hideFileDrop"
          :shouldAcceptFiles="!loadingAnimationVisible && !hideFileDrop"
          v-model="files"
        />
        <div class="button-container">
          <MDCButton class="clear-button" text="clear" @click="onClearClick" />
          <MDCButton
            class="decrypt-button"
            text="Decrypt"
            icon="lock"
            type="unelevated"
            @click="onDecryptClick"
          />
        </div>
        <DecryptResultsArea
          title="Decrypted Message"
          :text="resultText"
          :random-text-length="randomTextLength"
          @animationFinish="onAnimationFinish"
          @download="onDownloadClick"
          @copy="onCopyClick"
        />
      </ErrorBoundary>
    </Card>
  </div>
</template>

<script lang="ts">
import DecryptResultsArea from "@/components/Decrypt/DecryptResultsArea.vue";
import MDCButton from "@/components/MDC/MDCButton.vue";
import Card from "@/components/shared/Card.vue";
import CardErrorOverlay from "@/components/shared/CardErrorOverlay.vue";
import CardLoadingOverlay from "@/components/shared/CardLoadingOverlay.vue";
import FileDrop, { FileContainer } from "@/components/shared/FileDrop.vue";
import MessageTextArea from "@/components/shared/MessageTextArea.vue";
import OrText from "@/components/shared/OrText.vue";
import isCryptoUseable from "@/core/CryptoCheck";
import EncryptedFile from "@/core/EncryptedFile";
import EncryptedMessage from "@/core/EncryptedMessage";
import PrivateKey from "@/core/PrivateKey";
import CardError from "@/error/CardError";
import { downloadAsTxt } from "@/UIHelpers";
import { getPredictedLengthOfDecryptedString } from "@/UIHelpers";
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
    DecryptResultsArea,
    ErrorBoundary,
    CardErrorOverlay,
    CardLoadingOverlay,
  },
})
export default class Decrypt extends Vue {
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

  message = "";
  files: FileContainer[] = [];

  privateKeyString: string | undefined;
  privateKey: PrivateKey | undefined;

  resultText = "";
  randomTextLength = 0;

  created() {
    const parsedHash = new URLSearchParams(this.$route.hash.substr(1));

    this.privateKeyString = parsedHash.get("key") ?? undefined;
  }

  async mounted() {
    if (!isCryptoUseable()) {
      this.error = new CardError("Browser not supported", "");
      return;
    } else if (
      !this.privateKeyString ||
      this.privateKeyString.length <= 0 ||
      this.privateKeyString.match(/[^a-z0-9]/g) !== null
    ) {
      this.error = new CardError("Invalid Link", "");
      return;
    }

    this.privateKey = new PrivateKey(this.privateKeyString);

    await delay(1500);
    this.loadingAnimationVisible = false;
  }

  @Watch("message")
  onMessageChange() {
    this.hideOrText = this.message.length > 0 || this.files.length > 0;
    this.hideFileDrop = this.message.length > 0;
    if (this.message.length === 0) this.resultText = "";
  }

  @Watch("files")
  onFilesChange() {
    this.hideMessageTextArea = this.files.length > 0;
    this.hideOrText = this.message.length > 0 || this.files.length > 0;
    if (this.message.length === 0) this.resultText = "";
  }

  onClearClick() {
    this.message = "";
    this.files = [];
  }

  async onDecryptClick(e: Event) {
    if (
      !this.privateKey ||
      this.loadingAnimationVisible ||
      (this.message.length === 0 && this.files.length === 0)
    )
      return;
    (e.target as HTMLButtonElement)?.blur();

    this.loadingAnimationText = "Decrypting";
    this.loadingAnimationVisible = true;

    if (this.message.length > 0) {
      this.resultText = "";
      this.randomTextLength = getPredictedLengthOfDecryptedString(
        this.message.length
      );

      const encryptedMessage = new EncryptedMessage(
        this.message,
        this.privateKey
      );

      try {
        this.resultText = await encryptedMessage.decrypt();
      } catch (e) {
        this.error = new CardError(
          "Invalid Link or Message",
          "The message was not encrypted with the corresponding encryption link"
        );
      }

      this.randomTextLength = 0;
    } else if (this.files.length > 0) {
      for (const file of this.files) {
        const startTime = Date.now();
        const encryptedFile = new EncryptedFile(file.file, this.privateKey);

        try {
          await encryptedFile.decrypt();

          if (Date.now() - startTime < 5000) await delay(3000);

          encryptedFile.download();
        } catch (e) {
          this.error = new CardError(
            "Invalid Link or File",
            "A file was not encrypted with the corresponding encryption link"
          );
        }
      }

      this.loadingAnimationVisible = false;
    }
  }

  onAnimationFinish(textarea: HTMLTextAreaElement) {
    this.loadingAnimationVisible = false;
  }

  onDownloadClick() {
    if (this.resultText.length <= 0 || this.loadingAnimationVisible) return;

    downloadAsTxt(this.resultText, "decrypted-message.txt");
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

#decrypt {
  flex: 1;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  & > #decrypt-card {
    @include global.decrypt-card-background-auto;

    position: relative;

    &.error {
      & > *:not(.error-overlay) {
        display: none;
      }
    }

    & > .error-overlay {
      @include global.decrypt-card-background-auto;
    }

    .textarea-container > textarea {
      font-size: 1rem;
    }

    .file-drop-container > .file-drop-full-screen-overlay {
      background-color: rgba(darken(global.$decrypt-color, 30%), 0.7);
    }

    .button-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;

      & > .decrypt-button {
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
      font-size: 1.2rem;
    }
  }
}
</style>
