<template>
  <div
    ref="textareaContainer"
    class="textarea-container"
    :class="{
      invisible: textareaContainerInvisible,
      gone: textareaContainerGone,
    }"
  >
    <textarea
      ref="textarea"
      placeholder="Enter your message here"
      :value="message"
      :disabled="!shouldAcceptText"
      @input="onInput"
    ></textarea>
  </div>
</template>

<script lang="ts">
import delay from "delay";
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class MessageTextArea extends Vue {
  $refs!: {
    textareaContainer: HTMLDivElement;
    textarea: HTMLTextAreaElement;
  };

  @Prop(Boolean) readonly shouldAcceptText!: boolean;
  @Prop(Boolean) readonly hidden!: boolean;

  @Model("input", { type: String }) readonly message!: string;

  textareaContainerInvisible = false;
  textareaContainerGone = false;

  created() {
    const unWatchShouldAcceptText = this.$watch(
      "shouldAcceptText",
      async () => {
        if (this.shouldAcceptText) {
          unWatchShouldAcceptText();
          // check if textarea is visible
          if (this.$refs.textarea.getBoundingClientRect().top >= 0) {
            await this.$nextTick();
            this.$refs.textarea.focus();
          }
        }
      }
    );
  }

  onInput() {
    this.$emit("input", this.$refs.textarea.value);

    this.$refs.textarea.style.height = "auto";
    this.$refs.textarea.style.height =
      Math.max(this.$refs.textarea.scrollHeight, 100) + "px";
  }

  @Watch("hidden")
  onHiddenChange() {
    this.toggleTextareaContainerVisibility(!this.hidden);
  }

  async toggleTextareaContainerVisibility(visible: boolean) {
    if (visible) {
      this.textareaContainerGone = false;
      await delay(10);
      this.textareaContainerInvisible = false;
      await delay(250);
      if (!this.textareaContainerInvisible)
        this.$refs.textareaContainer.style.maxHeight = "";
    } else {
      this.$refs.textareaContainer.style.maxHeight = `${this.$refs.textareaContainer.clientHeight}px`;
      await delay(10);
      this.textareaContainerInvisible = true;
      await delay(250);
      if (this.textareaContainerInvisible) this.textareaContainerGone = true;
    }
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.textarea-container {
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 8px;

  transition-property: max-height, padding-bottom;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  contain: content;

  &.invisible {
    max-height: 0px !important;
    padding-bottom: 0px;
  }

  &.gone {
    display: none;
  }

  textarea {
    @include global.primary-text-auto;

    width: 100%;
    height: 100px;

    resize: none;
    border: none;
    outline: none;
    overflow-y: hidden;

    padding: 0px;
    margin: 0px;

    background-color: transparent;

    font-family: Roboto Slab, serif;

    &::placeholder {
      @include global.secondary-text-auto;
    }
  }
}
</style>
