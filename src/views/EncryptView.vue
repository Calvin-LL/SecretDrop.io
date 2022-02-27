<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";

import { FileContainer } from "@/types";
import FileDrop from "@/components/shared/file-drop/FileDrop.vue";
import ErrorOverlay from "@/components/shared/error-overlay/ErrorOverlay.vue";
import OrText from "@/components/shared/OrText.vue";
import MessageTextArea from "@/components/shared/MessageTextArea.vue";
import ErrorBoundary from "@/components/shared/ErrorBoundary.vue";
import Card from "@/components/shared/Card.vue";
import CardError from "@/CardError";

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
</script>

<template>
  <div id="encrypt">
    <Card
      id="encrypt-card"
      card-type="encryption"
      color="green"
      icon="lock"
      icon-style="outlined"
      title="Encrypt"
    >
      <template #subtitle>
        Only the person who has the decryption link can decrypt your message or
        file. Everything is done on this device. This page also works offline.
      </template>
      <template #default>
        <ErrorBoundary>
          <template #default>
            <MessageTextArea
              v-model:message="message"
              :show="type !== 'file'"
              :disabled="loadingResult || type === 'file'"
              placeholder="Enter your message here"
              font-size="big"
            />
            <OrText :show="type === undefined" />
            <FileDrop
              v-model:files="files"
              :show="type !== 'text'"
              color="green"
              text="Drop files here or click here to select files to encrypt"
              drop-text="Drop to encrypt"
              :disabled="loadingResult || type === 'text'"
            />
          </template>

          <template #error-overlay="{ error }">
            <ErrorOverlay
              v-if="error instanceof CardError"
              :title="error.title"
              :detail="error.message"
            />
            <ErrorOverlay
              title="Something went wrong"
              :detail="error.message"
            />
          </template>
        </ErrorBoundary>
      </template>
    </Card>
  </div>
</template>

<style lang="scss">
@use "@/scss/global";

#encrypt {
  flex: 1;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  & > #encrypt-card {
    .button-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
