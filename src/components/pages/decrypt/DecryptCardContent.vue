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
import { EncryptedFile } from "@/core/v1/EncryptedFile";
import { EncryptedText } from "@/core/v1/EncryptedText";
import type { PlainText } from "@/core/v1/PlainText";
import { PrivateKey } from "@/core/v1/PrivateKey";
import { checkSubtleCryptoInCard } from "@/helpers";
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
const decryptedMessage = ref("");

let decrypterPrivateKey: PrivateKey;
let decryptedText: PlainText;

onMounted(() => {
  try {
    const parsedHash = new URLSearchParams(document.location.hash.substring(1));
    const privateKeyString = parsedHash.get("key");
    if (!privateKeyString) {
      throw new CardError(
        "No key found",
        "No key was found in the URL. Please make sure you have the correct URL."
      );
    }
    try {
      decrypterPrivateKey = new PrivateKey(privateKeyString);
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
  decryptedMessage.value = "";
});

async function onDecryptClick() {
  try {
    switch (type.value) {
      case "text":
        await decryptText();
        break;
      case "file":
        await decryptFile();
        break;
    }
  } catch (error) {
    throw new CardError(
      "Failed to decrypt",
      "Failed to decrypt the message. Please make sure you have the correct URL and the message is not corrupted.",
      error as Error
    );
  }
}

function onDownloadClick() {
  decryptedText.download();
}

async function onCopyClick() {
  try {
    await navigator.clipboard.writeText(decryptedText.toString());

    await showSnackbar("Link copied to clipboard");
  } catch (error) {
    await showSnackbar("Failed to copy link to clipboard.");
  }
}

async function onEnterPressed() {
  if (type.value === "text") {
    await onDecryptClick();
  }
}

const textAnimator = new TextAnimator("decrypt", (s) => {
  decryptedMessage.value = s;
});

let sessionId = 0;

async function decryptText() {
  if (message.value.length === 0) {
    return;
  }

  const currentSessionId = ++sessionId;

  textAnimator.stopPreviousAnimation();

  const encryptedText = new EncryptedText(message.value.trim());

  loadingResult.value = true;
  textAnimator.startAnimation(message.value.length);

  decryptedText = await encryptedText.decrypt(decrypterPrivateKey);

  if (currentSessionId !== sessionId) {
    return;
  }

  textAnimator.endAnimation(
    decryptedText.toString(),
    decryptedMessage.value,
    () => {
      loadingResult.value = false;
    }
  );
}

async function decryptFile() {
  if (files.value.length === 0) {
    return;
  }

  loadingResult.value = true;

  for (const file of files.value) {
    const encryptedFile = new EncryptedFile(
      await file.file.arrayBuffer(),
      file.file.name
    );
    const decryptedFile = await encryptedFile.decrypt(decrypterPrivateKey);

    decryptedFile.download();
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
      placeholder="Paste the encrypted message here"
      :font-size="message.length > 0 ? 'small' : 'big'"
      :disabled="loadingResult || type === 'file'"
      :hidden="type === 'file'"
      @enter-pressed="onEnterPressed"
    />
    <OrText :hidden="type !== undefined" />
    <FileDrop
      v-model:files="files"
      color="black"
      text="Drop encrypted files here or click here to select encrypted files to decrypt"
      drop-text="Drop to decrypt"
      :disabled="loadingResult || type === 'text'"
      :hidden="type === 'text'"
    />

    <CryptButtonBar
      :loading="loadingResult && type === 'file'"
      loading-text="Decrypting on this device"
      type="decrypt"
      @crypt-click="onDecryptClick"
      @clear-click="onClearClick"
    />

    <TextResultArea
      title="Decrypted Message"
      :text="decryptedMessage"
      loading-text="Decrypting on this device"
      :loading="loadingResult"
      font-size="big"
      @download-click="onDownloadClick"
      @copy-click="onCopyClick"
    />
  </CardErrorBoundary>
</template>
