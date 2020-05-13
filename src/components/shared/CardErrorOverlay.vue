<template>
  <div
    class="error-overlay"
    :class="{
      invisible: overlayInvisible,
      gone: overlayGone,
    }"
  >
    <ErrorIcon :show="!(overlayInvisible && overlayGone)" />
    <h2>{{ title || "Error" }}</h2>
    <div class="detail">{{ detail }}</div>
  </div>
</template>

<script lang="ts">
import ErrorIcon from "@/components/shared/ErrorIcon.vue";
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({ components: { ErrorIcon } })
export default class CardErrorOverlay extends Vue {
  @Prop(String) readonly title: string | undefined;
  @Prop(String) readonly detail: string | undefined;

  overlayInvisible = true;
  overlayGone = true;

  @Watch("title", { immediate: true })
  onTitleChange() {
    this.onChange();
  }

  @Watch("detail", { immediate: true })
  onDetailChange() {
    this.onChange();
  }

  onChange() {
    this.toggleOverlayVisibility(
      (typeof this.title === "string" && this.title.length > 0) ||
        (typeof this.detail === "string" && this.detail.length > 0)
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
      if (this.overlayInvisible) this.overlayGone = true;
    }
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.error-overlay {
  @include global.flex-center;

  height: 100%;
  width: 100%;

  transition-property: opacity;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  pointer-events: all;

  contain: content;

  &.invisible {
    opacity: 0;
  }

  &.gone {
    display: none;
  }

  & > h2 {
    @include global.primary-text-auto;

    font-size: 2rem;
    font-weight: 400;

    margin-top: 0px;
  }

  & > .detail {
    margin-bottom: 0.83em;
  }
}
</style>
