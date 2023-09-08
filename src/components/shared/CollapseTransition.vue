<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  element: HTMLDivElement | null | undefined;
  elementVisible: boolean;
}>();

const elementHeight = ref(0);

onMounted(() => {
  addEventListener("resize", updateRootHeightValue);
});

watch(() => props.element, updateRootHeightValue);

onBeforeUnmount(() => {
  removeEventListener("resize", updateRootHeightValue);
});

function updateRootHeightValue() {
  if (props.elementVisible && props.element) {
    elementHeight.value = props.element.getBoundingClientRect().height;
  }
}

function setRootMaxHeight() {
  if (props.element) {
    if (elementHeight.value === 0) {
      let display = props.element.style.display;
      props.element.style.display = "";
      elementHeight.value = props.element.getBoundingClientRect().height;
      props.element.style.display = display;
    }

    props.element.style.maxHeight = `${elementHeight.value}px`;
  }
}

function removeRootMaxHeight() {
  if (props.element) {
    props.element.style.maxHeight = "";
  }
}
</script>

<template>
  <Transition
    name="collapse"
    @before-enter="setRootMaxHeight"
    @after-enter="removeRootMaxHeight"
    @enter-cancelled="removeRootMaxHeight"
    @before-leave="setRootMaxHeight"
    @after-leave="removeRootMaxHeight"
    @leave-cancelled="removeRootMaxHeight"
  >
    <slot />
  </Transition>
</template>

<style lang="scss" scoped>
@use "@/scss/transitions";
</style>
