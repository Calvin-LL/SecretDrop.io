<script setup lang="ts">
import ErrorIcon from "./ErrorIcon.vue";

defineProps<{
  title: string;
  detail: string;
}>();

function refresh() {
  window.location.reload();
}
</script>

<template>
  <div class="error-overlay">
    <ErrorIcon />
    <h2>{{ title || "Error" }}</h2>
    <div class="detail">{{ detail }}</div>
    <div class="refresh">
      <a href="" @click.prevent="refresh">Refresh to try again</a>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/scss/global";

.error-overlay {
  @include global.flex-center;

  height: 100%;
  width: 100%;

  padding-bottom: 16px;

  pointer-events: all;

  contain: content;

  & > h2 {
    @include global.primary-text-auto;

    font-size: 2rem;
    font-weight: 400;
    text-align: center;

    margin-top: 0px;
    margin-left: 16px;
    margin-right: 16px;
  }

  & > .detail {
    text-align: center;
    margin-bottom: 0.83em;
    margin-left: 16px;
    margin-right: 16px;
  }

  & > .refresh > a {
    @include global.link-text-auto;

    text-align: center;
    overflow-wrap: break-word;
    word-break: break-all;
  }
}
</style>
