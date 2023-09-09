<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

import { animateAddTextInElement } from "@/TextAnimator";
import { showSnackbar } from "@/components/layout/Snackbar/snackbar-manager";
import CardButtomBar from "@/components/shared/DownloadCopyBottonBar/DownloadCopyBottonBar.vue";
import { downloadAsTxt } from "@/helpers";

const props = defineProps<{
  keyString: string;
  cardType: "encrypt" | "decrypt";
}>();

let cancelTextAnimation: (() => void) | undefined;

const fullUrl = ref("");
const displayUrl = ref(" ".repeat(78));
const isLoading = ref(true);

onMounted(() => {
  const baseUrl = getUrlBase();

  fullUrl.value = `${baseUrl}${props.keyString}`;

  cancelTextAnimation = animateAddTextInElement(
    baseUrl,
    props.keyString,
    2000,
    (s) => {
      displayUrl.value = s;
    },
    () => {
      isLoading.value = false;
    }
  );
});

onBeforeUnmount(() => {
  cancelTextAnimation?.();
});

function getUrlBase() {
  const origin = import.meta.env.SSR
    ? ""
    : window.location.origin.replace("secretdrop.io", "SecretDrop.io");

  return `${origin}/${props.cardType}#key=`;
}

function onDownloadClick() {
  downloadAsTxt(fullUrl.value, `${props.cardType}ion-link.txt`);
}

async function onCopyClick() {
  try {
    await navigator.clipboard.writeText(fullUrl.value);

    await showSnackbar("Link copied to clipboard");
  } catch (error) {
    await showSnackbar("Failed to copy link to clipboard.");
  }
}
</script>

<template>
  <div class="link-card-url-container">
    <a
      ref="url"
      class="url"
      :class="{ loading: isLoading }"
      target="_blank"
      rel="noopener noreferrer nofollow"
      :href="fullUrl"
    >
      {{ displayUrl }}
    </a>
  </div>
  <CardButtomBar
    loading-text="Generating key on this device "
    :loading="isLoading"
    @download-click="onDownloadClick"
    @copy-click="onCopyClick"
  />
</template>

<style lang="scss" scoped>
@use "@fontsource/roboto-mono";
@use "@/scss/global";
@use "@/scss/colors";
@use "@/scss/transitions";

.link-card-url-container {
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 16px;

  & > a {
    font-family: "Roboto Mono", monospace;

    transition-property: color;
    transition-duration: transitions.$transition-duration-small;
    transition-timing-function: transitions.$transition-timing-function-standard;

    overflow-wrap: break-word;
    word-break: break-all;

    color: colors.$link-text-color;

    @media (prefers-color-scheme: dark) {
      color: colors.$link-text-color-dark;
    }

    &.loading {
      @include global.primary-text-auto;

      pointer-events: none;
      cursor: default;
    }
  }
}
</style>
