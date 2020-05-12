<template>
  <div
    ref="container"
    class="result-container"
    :class="{ invisible: containerInvisible, gone: containerGone }"
  >
    <CardTitle :title="title" :subtitle="subtitle" />
    <ResultTextArea
      :text="text"
      :random-text-length="randomTextLength"
      @animationFinish="$emit('animationFinish', $event)"
    />
    <CardButtonBar
      :visibility="!containerGone"
      @download="$emit('download', $event)"
      @copy="$emit('copy', $event)"
    />
  </div>
</template>

<script lang="ts">
import ResultTextArea from "@/components/Encrypt/ResultTextArea.vue";
import CardButtonBar from "@/components/shared/CardButtonBar.vue";
import CardTitle from "@/components/shared/CardTitle.vue";
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({ components: { CardTitle, ResultTextArea, CardButtonBar } })
export default class ResultsArea extends Vue {
  $refs!: {
    container: HTMLDivElement;
  };

  @Prop(String) readonly title!: string;
  @Prop(String) readonly subtitle!: string;

  @Prop(String) readonly text!: string;
  @Prop(Number) readonly randomTextLength!: number;

  containerInvisible = false;
  containerGone = false;

  get hidden() {
    return (this.text.length === 0 && this.randomTextLength === 0) == true;
  }

  mounted() {
    this.$refs.container.style.maxHeight = `${this.$refs.container.clientHeight}px`;
    this.containerInvisible = true;
    this.containerGone = true;
  }

  @Watch("hidden")
  onHiddenChange() {
    this.toggleContainerVisibility(!this.hidden);
  }

  async toggleContainerVisibility(visible: boolean) {
    if (visible) {
      this.containerGone = false;
      await delay(10);
      this.containerInvisible = false;
      await delay(250);
      if (!this.containerInvisible) this.$refs.container.style.maxHeight = "";
    } else {
      this.$refs.container.style.maxHeight = `${this.$refs.container.clientHeight}px`;
      await delay(10);
      this.containerInvisible = true;
      await delay(250);
      if (this.containerInvisible) this.containerGone = true;
    }
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.result-container {
  overflow: hidden;

  transition-property: max-height, margin;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  &.invisible {
    max-height: 0px !important;
    margin: 0px;
  }

  &.gone {
    display: none;
  }

  & > .title-container {
    width: 100%;
    box-sizing: border-box;
    margin-top: 8px;
    margin-bottom: 16px;
    padding-left: 8px;
    padding-right: 8px;

    & > .title {
      font-weight: 500;
      margin: 0px;
      margin-bottom: 4px;
    }

    & > .subtitle {
      @include global.secondary-text-auto;
    }
  }
}
</style>
