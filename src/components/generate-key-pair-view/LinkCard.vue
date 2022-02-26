<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

import Card from "../shared/Card.vue";

import { showSnackbar } from "@/snackbar-manager";
import { animateAddTextInElement, downloadAsTxt } from "@/helpers";
import Button from "@/components/shared/Button.vue";

const props = defineProps<{
  color: "green" | "red";
  icon: string;
  iconStyle: "round" | "outlined";
  title: string;
  baseUrl: string;
  keyString: string;
  cardType: "encryption" | "decryption";
}>();

const emit = defineEmits<{
  (e: "animationFinish"): void;
}>();

let cancelTextAnimation: (() => void) | undefined;

const displayUrl = ref("");

onMounted(() => {
  cancelTextAnimation = animateAddTextInElement(
    props.baseUrl,
    props.keyString,
    1500,
    (s) => {
      displayUrl.value = s;
    },
    () => {
      emit("animationFinish");
    }
  );
});

onBeforeUnmount(() => {
  cancelTextAnimation?.();
});

function downloadLink() {
  const url = props.baseUrl + props.keyString;

  downloadAsTxt(url, `${props.cardType}-link.txt`);
}

async function copyLink() {
  const url = props.baseUrl + props.keyString;

  try {
    await navigator.clipboard.writeText(url);

    await showSnackbar("Link copied to clipboard");
  } catch (error) {
    await showSnackbar("Failed to copy link to clipboard.");
  }
}
</script>

<template>
  <Card :color="color" :icon="icon" :icon-style="iconStyle" :title="title">
    <template #subtitle>
      <slot name="subtitle"></slot>
    </template>
    <template #default>
      <div class="link-card-url-container">
        <a
          ref="url"
          class="url"
          target="_blank"
          rel="noopener noreferrer nofollow"
          :href="baseUrl + keyString"
        >
          {{ displayUrl }}
        </a>
      </div>
      <div class="bottom-bar-container">
        <div class="bottom-bar">
          <Button
            text-color="secondary"
            icon="save_alt"
            @click="downloadLink()"
          />
          <Button
            text-color="secondary"
            icon="file_copy"
            icon-style="outlined"
            @click="copyLink()"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<style lang="scss">
.link-card-url-container {
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 16px;

  & > a {
    overflow-wrap: break-word;
    word-break: break-all;
    color: #1976d2;

    &:visited {
      color: #512da8;
    }
  }
}

.bottom-bar-container {
  width: 100%;
  contain: content;

  & > .bottom-bar {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
