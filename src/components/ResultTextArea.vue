<template>
  <div class="result-textarea-container">
    <textarea ref="textarea" readonly :value="processedText"></textarea>
  </div>
</template>

<script lang="ts">
import {
  animateAddTextInElement,
  fillElementWithRandomText,
} from "@/UIHelpers";
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class ResultTextArea extends Vue {
  $refs!: {
    textarea: HTMLTextAreaElement;
  };

  @Prop(String) readonly text: string | undefined;
  @Prop(Number) readonly randomTextLength: number | undefined;

  processedText = "";
  stopFillElementWithRandomText: (() => void) | undefined;

  @Watch("text")
  onTextChange() {
    this.onChange();
  }

  @Watch("randomTextLength")
  onRandomTextLengthChange() {
    this.onChange();
  }

  onChange() {
    this.stopFillElementWithRandomText?.();

    if (this.text) {
      animateAddTextInElement(
        "",
        this.text,
        3000,
        (s) => {
          console.log(s);
          this.processedText = s;
          this.updateTextAreaHeight();
        },
        () => {
          this.$emit("animationFinish");
        }
      );
    } else if (this.randomTextLength) {
      this.stopFillElementWithRandomText = fillElementWithRandomText(
        this.randomTextLength,
        (s) => {
          this.processedText = s;
          this.updateTextAreaHeight();
        }
      );
    }
  }

  updateTextAreaHeight() {
    this.$refs.textarea.style.height = "auto";
    this.$refs.textarea.style.height =
      Math.max(this.$refs.textarea.scrollHeight, 100) + "px";
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.result-textarea-container {
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 8px;

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
