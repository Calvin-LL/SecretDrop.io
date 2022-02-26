<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import Card from "../shared/Card.vue";
import AnimatedSafe from "../shared/AnimatedSafe.vue";

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

let cancelTextAnimation: (() => void) | undefined;

const fullUrl = computed(() => props.baseUrl + props.keyString);
const displayUrl = ref("");
const showLoadingAnimation = ref(true);

onMounted(() => {
  cancelTextAnimation = animateAddTextInElement(
    props.baseUrl,
    props.keyString,
    2000,
    (s) => {
      displayUrl.value = s;
    },
    () => {
      showLoadingAnimation.value = false;
    }
  );
});

onBeforeUnmount(() => {
  cancelTextAnimation?.();
});

function downloadLink() {
  downloadAsTxt(fullUrl.value, `${props.cardType}-link.txt`);
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(fullUrl.value);

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
          :class="{ loading: showLoadingAnimation }"
          target="_blank"
          rel="noopener noreferrer nofollow"
          :href="fullUrl"
        >
          {{ displayUrl }}
        </a>
      </div>
      <div class="bottom-bar-container">
        <Transition>
          <div v-if="showLoadingAnimation" class="loading-bar">
            <AnimatedSafe class="animated-safe" width="36px" />
            <div class="label">Generating key locally</div>
          </div>
          <div v-else class="botton-bar">
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
        </Transition>
      </div>
    </template>
  </Card>
</template>

<style lang="scss">
@use "@fontsource/roboto-mono";
@use "@/scss/global";
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
    color: #1976d2;

    &:visited {
      color: #512da8;
    }

    &.loading {
      @include global.primary-text-auto;

      pointer-events: none;
      cursor: default;
    }
  }
}

.bottom-bar-container {
  position: relative;

  width: 100%;
  height: 48px;

  & > .loading-bar {
    @include global.absolute-overlay;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    & > .animated-safe {
      margin-left: 8px;
      margin-right: 8px;
    }

    & > .label {
      @include global.secondary-text-auto;

      font-size: 1.1rem;
      font-weight: 400;
    }
  }

  & > .botton-bar {
    @include global.absolute-overlay;

    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  & > .v-enter-active {
    transition-property: opacity;
    transition-duration: transitions.$transition-duration-small;
    transition-timing-function: transitions.$transition-timing-function-deceleration;
  }

  & > .v-leave-active {
    transition-property: opacity;
    transition-duration: transitions.$transition-duration-small;
    transition-timing-function: transitions.$transition-timing-function-acceleration;
  }

  & > .v-enter-from,
  & > .v-leave-to {
    opacity: 0;
  }
}
</style>
