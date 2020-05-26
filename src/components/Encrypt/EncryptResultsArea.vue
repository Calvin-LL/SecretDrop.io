<template>
  <ResultsArea
    :title="title"
    :subtitle="subtitle"
    :hidden="hidden"
    @download="$emit('download', $event)"
    @copy="$emit('copy', $event)"
  >
    <EncryptResultTextArea
      :text="text"
      :random-text-length="randomTextLength"
      @animationFinish="$emit('animationFinish', $event)"
    />
  </ResultsArea>
</template>

<script lang="ts">
import EncryptResultTextArea from "@/components/Encrypt/EncryptResultTextArea.vue";
import ResultsArea from "@/components/shared/ResultsArea.vue";
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({ components: { ResultsArea, EncryptResultTextArea } })
export default class EncryptResultsArea extends Vue {
  @Prop(String) readonly title!: string;
  @Prop(String) readonly subtitle!: string;

  @Prop(String) readonly text!: string;
  @Prop(Number) readonly randomTextLength!: number;

  get hidden() {
    return (this.text.length === 0 && this.randomTextLength === 0) == true;
  }
}
</script>
