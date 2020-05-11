<template>
  <p class="or-p" :class="{ invisible: orTextInvisible, gone: orTextGone }">
    or
  </p>
</template>

<script lang="ts">
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class OrText extends Vue {
  @Prop(Boolean) readonly hidden!: boolean;

  orTextInvisible = false;
  orTextGone = false;

  @Watch("hidden")
  onHiddenChange() {
    this.toggleOrTextVisibility(!this.hidden);
  }

  async toggleOrTextVisibility(visible: boolean) {
    if (visible) {
      this.orTextGone = false;
      await delay(10);
      this.orTextInvisible = false;
    } else {
      await delay(10);
      this.orTextInvisible = true;
      await delay(250);
      if (this.orTextInvisible) this.orTextGone = true;
    }
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

.or-p {
  @include global.secondary-text-auto;
  text-align: center;
  font-size: 1rem;
  line-height: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  max-height: 2rem;

  overflow: hidden;

  transition-property: max-height, margin;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  &.invisible {
    max-height: 0px;
    margin: 0px;
  }

  &.gone {
    display: none;
  }
}
</style>
