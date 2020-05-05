<template>
  <div
    class="error-overlay"
    :class="{
      invisible: overlayInvisible,
      gone: overlayGone,
    }"
  >
    <ErrorIcon :show="!(overlayInvisible && overlayGone)" />
    <h2>{{ title }}</h2>
    <div class="detail">{{ detail }}</div>
  </div>
</template>

<script lang="ts">
import ErrorIcon from "@/components/ErrorIcon.vue";
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({ components: { ErrorIcon } })
export default class CardErrorOverlay extends Vue {
  @Prop(String) readonly title: string | undefined;
  @Prop(String) readonly detail: string | undefined;

  overlayInvisible = true;
  overlayGone = true;

  @Watch("title")
  onTitleChange() {
    this.onChange();
  }

  @Watch("detail")
  onDetailChange() {
    this.onChange();
  }

  onChange() {
    this.toggleOverlayVisibility(
      this.title !== undefined || this.detail !== undefined
    );
  }

  async toggleOverlayVisibility(visible: boolean) {
    if (visible) {
      this.overlayGone = false;
      await delay(10);
      this.overlayInvisible = false;
    } else {
      await delay(10);
      this.overlayInvisible = true;
      await delay(250);
      this.overlayGone = true;
    }
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.error-overlay {
  @include global.absolute-overlay;
  @include global.flex-center;

  z-index: 10;

  transition-property: opacity;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  &.invisible {
    opacity: 0;
  }

  &.gone {
    display: none;
  }

  h1 {
    margin-top: 0px;
  }

  .detail {
    margin-bottom: 0.83em;
  }
}
</style>
