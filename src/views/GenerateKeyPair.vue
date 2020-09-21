<template>
  <div class="home">
    <div class="card-container">
      <LinkCard
        id="encryption-link-card"
        title="Encryption Link"
        subtitle="Files and messages encrypted with this link can only be decrypted with the link in the other box. Share this link."
        :baseUrl="encryptLinkBaseUrl"
        :keyString="publicKeyString"
        @download="onEncryptLinkDownload"
        @copy="onEncryptLinkCopy"
        @animationFinish="onAnimationFinish"
      />
    </div>
    <div class="card-container">
      <LinkCard
        id="decryption-link-card"
        title="Decryption Link"
        subtitle="This link can only decrypt files and messages encrypted with the link in the other box. <span class='warning'>Never share this link.</span>"
        :baseUrl="decryptLinkBaseUrl"
        :keyString="privatekeyString"
        @download="onDecryptLinkDownload"
        @copy="onDecryptLinkCopy"
        @animationFinish="onAnimationFinish"
      />
    </div>

    <FullScreenLoadingOverlay :hidden="hideLoadingOverlay" />
  </div>
</template>

<script lang="ts">
import FullScreenLoadingOverlay from "@/components/GenerateKeyPair/FullScreenLoadingOverlay.vue";
import LinkCard from "@/components/GenerateKeyPair/LinkCard.vue";
import KeyPair from "@/core/KeyPair";
import { downloadAsTxt } from "@/UIHelpers";
import { writeText as copy } from "clipboard-polyfill";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: { LinkCard, FullScreenLoadingOverlay },
})
export default class GenerateKeyPair extends Vue {
  encryptLinkBaseUrl = `${window.location.origin}/encrypt#key=`;
  decryptLinkBaseUrl = `${window.location.origin}/decrypt#key=`;

  publicKeyString = "";
  privatekeyString = "";

  animationFinishCount = 0;
  hideLoadingOverlay = false;

  get fullEncryptLink() {
    return this.encryptLinkBaseUrl + this.publicKeyString;
  }

  get fullDecryptLink() {
    return this.decryptLinkBaseUrl + this.privatekeyString;
  }

  created() {
    const keyPair = new KeyPair();

    this.publicKeyString = keyPair.getPublicKeyString();
    this.privatekeyString = keyPair.getPrivateKeyString();
  }

  onAnimationFinish() {
    if (this.animationFinishCount++ === 1) this.hideLoadingOverlay = true;
  }

  onEncryptLinkDownload() {
    downloadAsTxt(this.fullEncryptLink, "encryption-link.txt");
  }

  onDecryptLinkDownload() {
    downloadAsTxt(this.fullDecryptLink, "decryption-link.txt");
  }

  onEncryptLinkCopy() {
    if (copy(this.fullEncryptLink))
      this.$root.$emit("show-snackbar", "Copied to clipboard.");
    else
      this.$root.$emit(
        "show-snackbar",
        "Failed to copy to clipboard. Try copying the link manually."
      );
  }

  onDecryptLinkCopy() {
    copy(this.fullDecryptLink)
      .then(() => this.$root.$emit("show-snackbar", "Copied to clipboard."))
      .catch(() =>
        this.$root.$emit(
          "show-snackbar",
          "Failed to copy to clipboard. Try copying the link manually."
        )
      );
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.home {
  position: relative;

  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  & > .card-container {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    & > #encryption-link-card {
      @include global.encrypt-card-background-auto;
    }

    & > #decryption-link-card {
      @include global.decrypt-card-background-auto;

      margin-top: 48px;
    }
  }
}
</style>
