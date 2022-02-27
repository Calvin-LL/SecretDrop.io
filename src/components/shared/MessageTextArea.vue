<script setup lang="ts">
withDefaults(
  defineProps<{
    show?: boolean;
    placeholder: string;
    message: string;
    disabled?: boolean;
    fontSize?: "big" | "small";
  }>(),
  {
    fontSize: "small",
  }
);

const emit = defineEmits<{
  (e: "update:message", message: string): void;
}>();

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  const newMessage = target.value;

  emit("update:message", newMessage);

  target.style.height = "auto";
  target.style.height = `${target.scrollHeight}px`;
}
</script>

<template>
  <Transition name="collapse">
    <div v-if="show" class="textarea-container">
      <textarea
        :class="fontSize"
        :placeholder="placeholder"
        :readonly="disabled"
        :value="message"
        @input="onInput"
      />
    </div>
  </Transition>
</template>

<style lang="scss">
@use "@fontsource/roboto-slab/400" as *;
@use "@/scss/global";
@use "@/scss/transitions";

.textarea-container {
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 8px;

  contain: content;

  &.collapse-enter-to,
  &.collapse-leave-from {
    max-height: 100px;
  }

  & > textarea {
    @include global.primary-text-auto;

    width: 100%;
    min-height: 100px;

    resize: none;
    border: none;
    outline: none;
    overflow-y: hidden;

    padding: 0px;
    margin: 0px;

    background-color: transparent;

    font-family: "Roboto Slab", serif;

    &::placeholder {
      @include global.secondary-text-auto;
    }

    &.big {
      font-size: 1.2rem;
    }
  }
}
</style>
