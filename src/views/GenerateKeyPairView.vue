<script setup lang="ts">
import KeyPair from "@/core/KeyPair";
import LinkCard from "@/components/generate-key-pair-view/LinkCard.vue";

const encryptLinkBaseUrl = `${window.location.origin}/encrypt#key=`;
const decryptLinkBaseUrl = `${window.location.origin}/decrypt#key=`;

const keyPair = new KeyPair();

const publicKeyString = keyPair.getPublicKeyString();
const privatekeyString = keyPair.getPrivateKeyString();
</script>

<template>
  <div id="generate-key-pair">
    <LinkCard
      id="encryption-link-card"
      card-type="encryption"
      color="green"
      icon="lock"
      icon-style="outlined"
      title="Public Encryption Link"
      :base-url="encryptLinkBaseUrl"
      :key-string="publicKeyString"
    >
      <template #subtitle>
        Files and messages encrypted with this link can only be decrypted with
        the decryption link. Share this link.
      </template>
    </LinkCard>

    <LinkCard
      id="decryption-link-card"
      card-type="decryption"
      color="red"
      icon="key"
      icon-style="round"
      title="Private Decryption Link"
      :base-url="decryptLinkBaseUrl"
      :key-string="privatekeyString"
    >
      <template #subtitle>
        This link can only decrypt files and messages encrypted with the
        encryption link. <span class="warning">Never share this link.</span>
      </template>
    </LinkCard>
  </div>
</template>

<style lang="scss">
#generate-key-pair {
  position: relative;

  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  & > #decryption-link-card {
    margin-top: 64px;
  }
}
</style>
