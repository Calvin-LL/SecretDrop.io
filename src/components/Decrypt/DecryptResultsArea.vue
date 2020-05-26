<template>
  <ResultsArea
    :title="title"
    :subtitle="subtitle"
    :hidden="hidden"
    @download="$emit('download', $event)"
    @copy="$emit('copy', $event)"
  >
    <DecryptResultTextArea
      :text="text"
      :random-text-length="randomTextLength"
      @animationFinish="$emit('animationFinish', $event)"
    />
  </ResultsArea>
</template>

<script lang="ts">
import DecryptResultTextArea from "@/components/Decrypt/DecryptResultTextArea.vue";
import ResultsArea from "@/components/shared/ResultsArea.vue";
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({ components: { ResultsArea, DecryptResultTextArea } })
export default class DecryptResultsArea extends Vue {
  @Prop(String) readonly title!: string;
  @Prop(String) readonly subtitle!: string;

  @Prop(String) readonly text!: string;
  @Prop(Number) readonly randomTextLength!: number;

  get hidden() {
    return (this.text.length === 0 && this.randomTextLength === 0) == true;
  }
}
</script>
