<template>
  <div
    class="loading-overlay"
    :class="{
      invisible: overlayInvisible,
      gone: overlayGone,
    }"
  >
    <AnimatedLogo class="animate" />
    <h2>
      <slot></slot>
    </h2>
  </div>
</template>

<script lang="ts">
import AnimatedLogo from "@/components/shared/AnimatedLogo.vue";
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({ components: { AnimatedLogo } })
export default class CardLoadingOverlay extends Vue {
  @Prop(Boolean) readonly hidden!: boolean;

  overlayInvisible = true;
  overlayGone = true;

  @Watch("hidden", { immediate: true })
  onHiddenChange() {
    this.toggleOverlayVisibility(!this.hidden);
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

.loading-overlay {
  @include global.absolute-overlay;
  @include global.flex-center;

  z-index: 10;

  transition-property: opacity;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  background-color: global.$overlay-color;

  pointer-events: all;

  &.invisible {
    opacity: 0;
  }

  &.gone {
    display: none;
  }

  .animated-logo {
    width: 21%;
  }

  h2 {
    color: global.$primary-text-color-dark;
    font-size: 1.5rem;
    font-weight: 400;
  }
}
</style>
