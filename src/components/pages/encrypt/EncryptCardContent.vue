<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from "vue";

import CardError from "@/CardError";
import { TextAnimator } from "@/TextAnimator";
import { showSnackbar } from "@/components/layout/Snackbar/snackbar-manager";
import CardErrorBoundary from "@/components/shared/CardErrorBoundary/CardErrorBoundary.vue";
import CryptButtonBar from "@/components/shared/CryptButtonBar/CryptButtonBar.vue";
import FileDrop from "@/components/shared/FileDrop/FileDrop.vue";
import MessageTextArea from "@/components/shared/MessageTextArea.vue";
import OrText from "@/components/shared/OrText.vue";
import TextResultArea from "@/components/shared/TextResultArea.vue";
import type { EncryptedText } from "@/core/v1/EncryptedText";
import { KeyPair } from "@/core/v1/KeyPair";
import { PlainFile } from "@/core/v1/PlainFile";
import { PlainText } from "@/core/v1/PlainText";
import { PublicKey } from "@/core/v1/PublicKey";
import { checkSubtleCryptoInCard, delay } from "@/helpers";
import type { FileContainer } from "@/types";

const error = ref<Error>();

const loadingResult = ref(false);
const message = ref("");
const files = shallowRef<FileContainer[]>([]);
const type = computed(() => {
  if (message.value.length > 0) {
    return "text";
  } else if (files.value.length > 0) {
    return "file";
  }

  return undefined;
});
const encryptedMessage = ref("");

let decrypterPublicKey: PublicKey;
let encryptedText: EncryptedText;

onMounted(() => {
  try {
    const parsedHash = new URLSearchParams(document.location.hash.substring(1));
    const publicKeyString = parsedHash.get("key");
    if (!publicKeyString) {
      throw new CardError(
        "No key found",
        "No key was found in the URL. Please make sure you have the correct URL."
      );
    }
    try {
      decrypterPublicKey = new PublicKey(publicKeyString);
    } catch (error) {
      throw new CardError(
        "Invalid key",
        "The key in the URL is invalid. Please make sure you have the correct URL.",
        error as Error
      );
    }

    checkSubtleCryptoInCard();
  } catch (err) {
    error.value = err as Error;
  }
});

watch(message, () => {
  encryptedMessage.value = "";
});

async function onEncryptClick() {
  try {
    switch (type.value) {
      case "text":
        await encryptText();
        break;
      case "file":
        await encryptFile();
        break;
    }
  } catch (error) {
    throw new CardError(
      "Failed to encrypt",
      "Failed to encrypt the message. Please make sure you have the correct URL.",
      error as Error
    );
  }
}

function onDownloadClick() {
  encryptedText.download();
}

async function onCopyClick() {
  try {
    await navigator.clipboard.writeText(encryptedText.toString());

    await showSnackbar("Link copied to clipboard");
  } catch (error) {
    await showSnackbar("Failed to copy link to clipboard.");
  }
}

async function onEnterPressed() {
  if (type.value === "text") {
    await onEncryptClick();
  }
}

const textAnimator = new TextAnimator("encrypt", (s) => {
  encryptedMessage.value = s;
});

let sessionId = 0;

async function encryptText() {
  if (message.value.length === 0) {
    return;
  }

  const currentSessionId = ++sessionId;

  textAnimator.stopPreviousAnimation();

  const encrypterKeyPair = new KeyPair();
  const plainText = new PlainText(message.value);

  loadingResult.value = true;
  textAnimator.startAnimation(message.value.length);

  encryptedText = await plainText.encrypt(
    encrypterKeyPair.privateKey,
    decrypterPublicKey
  );

  if (currentSessionId !== sessionId) {
    return;
  }

  textAnimator.endAnimation(
    encryptedText.toString(),
    encryptedMessage.value,
    () => {
      loadingResult.value = false;
    }
  );
}

async function encryptFile() {
  if (files.value.length === 0) {
    return;
  }

  loadingResult.value = true;

  const perFileMinTime = 3000 / files.value.length;

  for (const file of files.value) {
    await Promise.all([
      delay(perFileMinTime),
      (async () => {
        const encrypterKeyPair = new KeyPair();
        const plainFile = new PlainFile(
          await file.file.arrayBuffer(),
          file.file.name
        );
        const encryptedFile = await plainFile.encrypt(
          encrypterKeyPair.privateKey,
          decrypterPublicKey
        );

        encryptedFile.download();
      })(),
    ]);
  }

  loadingResult.value = false;
}

function onClearClick() {
  textAnimator.stopPreviousAnimation();
  loadingResult.value = false;
  message.value = "";
  files.value = [];
}
</script>

<template>
  <CardErrorBoundary :error="error">
    <MessageTextArea
      v-model:message="message"
      placeholder="Enter your message here"
      font-size="big"
      :disabled="loadingResult || type === 'file'"
      :hidden="type === 'file'"
      @enter-pressed="onEnterPressed"
    />
    <OrText :hidden="type !== undefined" />
    <FileDrop
      v-model:files="files"
      color="green"
      text="Drop files here or click here to select files to encrypt"
      drop-text="Drop to encrypt"
      :disabled="loadingResult || type === 'text'"
      :hidden="type === 'text'"
    />

    <CryptButtonBar
      :loading="loadingResult && type === 'file'"
      loading-text="Encrypting on this device"
      type="encrypt"
      @crypt-click="onEncryptClick"
      @clear-click="onClearClick"
    />

    <TextResultArea
      title="Encrypted Message"
      :text="encryptedMessage"
      loading-text="Encrypting on this device"
      :loading="loadingResult"
      @download-click="onDownloadClick"
      @copy-click="onCopyClick"
    >
      <template #subtitle>
        You can post or send the encrypted files anywhere. Only the person who
        has the decryption link can decrypt the files.
      </template>
    </TextResultArea>
  </CardErrorBoundary>
</template>
