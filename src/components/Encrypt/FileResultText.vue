<template>
  <div
    ref="fileResultText"
    class="file-result-text"
    :class="{ invisible: fileResultTextInvisible, gone: fileResultTextGone }"
  >
    You may post or send the encrypted files anywhere. Only the person who has
    the decryption link can decrypt the files.
  </div>
</template>

<script lang="ts">
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class FileResultText extends Vue {
  $refs!: {
    fileResultText: HTMLDivElement;
  };

  @Prop(Boolean) readonly hidden!: boolean;

  fileResultTextInvisible = false;
  fileResultTextGone = false;

  mounted() {
    this.$refs.fileResultText.style.maxHeight = `${this.$refs.fileResultText.clientHeight}px`;
    this.fileResultTextInvisible = true;
    this.fileResultTextGone = true;
  }

  @Watch("hidden")
  onHiddenChange() {
    this.toggleFileResultTextVisibility(!this.hidden);
  }

  async toggleFileResultTextVisibility(visible: boolean) {
    if (visible) {
      this.fileResultTextGone = false;
      await delay(10);
      this.fileResultTextInvisible = false;
      await delay(250);
      if (!this.fileResultTextInvisible)
        this.$refs.fileResultText.style.maxHeight = "";
    } else {
      this.$refs.fileResultText.style.maxHeight = `${this.$refs.fileResultText.clientHeight}px`;
      await delay(10);
      this.fileResultTextInvisible = true;
      await delay(250);
      if (this.fileResultTextInvisible) this.fileResultTextGone = true;
    }
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.file-result-text {
  @include global.secondary-text-auto;
  font-size: 1rem;

  overflow: hidden;

  transition-property: max-height, margin;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  margin-top: 16px;
  margin-bottom: 8px;
  margin-left: 8px;
  margin-right: 8px;

  &.invisible {
    max-height: 0px !important;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  &.gone {
    display: none;
  }
}
</style>
