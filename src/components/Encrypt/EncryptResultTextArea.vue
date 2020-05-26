<template>
  <ResultTextArea
    v-bind="$attrs"
    @focus="onFocus"
    @animationFinish="onAnimationFinish"
  />
</template>

<script lang="ts">
import ResultTextArea from "@/components/shared/ResultTextArea.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { ResultTextArea } })
export default class EncryptResultTextArea extends Vue {
  onFocus(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    textarea.select();
  }

  onAnimationFinish(textarea: HTMLTextAreaElement) {
    textarea.focus();

    this.$emit("animationFinish", textarea);
  }
}
</script>
