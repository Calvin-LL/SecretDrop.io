<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const root = ref<HTMLDivElement>();
const child = ref<HTMLDivElement>();
const childHeight = ref(0);
const topBarHeight = ref(0);

onMounted(() => {
  window.addEventListener("resize", updateHeight);
  updateHeight();

  // add this to let the test know that the component is loaded
  document.body.dataset.loaded = "";
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});

function updateHeight() {
  const topBar = document.getElementById("top-bar");

  topBarHeight.value = topBar?.getBoundingClientRect().height ?? 0;

  childHeight.value = child.value?.getBoundingClientRect().height ?? 0;
}
</script>

<template>
  <div
    ref="root"
    :style="{
      minHeight: `max(0px, calc(100lvh - ${topBarHeight}px))`,
    }"
  >
    <div
      ref="child"
      :style="{
        marginTop: `max(0px, calc((100lvh - ${childHeight}px) / 2 - ${topBarHeight}px)`,
      }"
    >
      <slot />
    </div>
  </div>
</template>
