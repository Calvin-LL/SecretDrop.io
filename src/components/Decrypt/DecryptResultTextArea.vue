<template>
  <ResultTextArea v-bind="$attrs" @animationFinish="onAnimationFinish" />
</template>

<script lang="ts">
import ResultTextArea from "@/components/shared/ResultTextArea.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { ResultTextArea } })
export default class DecryptResultTextArea extends Vue {
  onAnimationFinish(textarea: HTMLTextAreaElement) {
    textarea.focus();

    this.$emit("animationFinish", textarea);
  }
}
</script>
