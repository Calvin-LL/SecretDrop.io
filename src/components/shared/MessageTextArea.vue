<script setup lang="ts">
import CollapseTransition from "@/components/shared/CollapseTransition.vue";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    message: string;
    disabled?: boolean;
    hidden?: boolean;
    fontSize?: "big" | "small";
    disableSpellcheck?: boolean;
  }>(),
  {
    fontSize: "small",
  }
);

const emit = defineEmits<{
  "update:message": [message: string];
  enterPressed: [e: KeyboardEvent];
}>();

const root = ref<HTMLDivElement>();
const textarea = ref<HTMLTextAreaElement>();

onMounted(() => {
  addEventListener("resize", updateTextAreaHeight);
});

watch(() => props.message, updateTextAreaHeight);

onBeforeUnmount(() => {
  removeEventListener("resize", updateTextAreaHeight);
});

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  const newMessage = target.value;

  emit("update:message", newMessage);

  updateTextAreaHeight();
}

function updateTextAreaHeight() {
  if (textarea.value) {
    textarea.value.style.height = "auto";
    textarea.value.style.height =
      Math.max(textarea.value.scrollHeight, 100) + "px";
  }
}
</script>

<template>
  <CollapseTransition :element="root" :elementVisible="!hidden">
    <div v-show="!hidden" ref="root" class="textarea-container">
      <textarea
        ref="textarea"
        :class="fontSize"
        :placeholder="placeholder"
        :readonly="disabled"
        :value="message"
        :spellcheck="!disableSpellcheck"
        @input="onInput"
        @keydown.ctrl.enter.exact.prevent="
          !disabled && emit('enterPressed', $event)
        "
        @keydown.meta.enter.exact.prevent="
          !disabled && emit('enterPressed', $event)
        "
      />
    </div>
  </CollapseTransition>
</template>

<style lang="scss" scoped>
@use "@fontsource/roboto-slab/400" as *;
@use "@/scss/global";
@use "@/scss/transitions";

.textarea-container {
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 8px;

  & > textarea {
    @include global.primary-text-auto;

    width: 100%;
    min-height: 100px;

    box-sizing: border-box;

    resize: none;
    border: none;
    outline: none;
    overflow-y: hidden;

    padding: 0px;
    margin: 0px;

    background-color: transparent;

    font-family: "Roboto Slab", serif;
    word-break: break-all;
    line-break: anywhere;

    &::placeholder {
      @include global.secondary-text-auto;
    }

    &.big {
      font-size: 1.2rem;
    }
  }
}
</style>
