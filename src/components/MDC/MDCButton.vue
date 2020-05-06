<template>
  <button
    ref="button"
    class="mdc-button"
    :class="{
      'mdc-button--raised': type === 'raised',
      'mdc-button--unelevated': type === 'unelevated',
    }"
    @click="$emit('click', arguments)"
  >
    <div class="mdc-button__ripple"></div>
    <i
      class="material-icons-outlined mdc-button__icon"
      aria-hidden="true"
      v-if="icon"
      >{{ icon }}</i
    >
    <span class="mdc-button__label">{{ text }}</span>
  </button>
</template>

<script lang="ts">
import { MDCRipple } from "@material/ripple";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MDCButton extends Vue {
  @Prop(String) readonly type: string | undefined;
  @Prop(String) readonly text: string | undefined;
  @Prop(String) readonly href: string | undefined;
  @Prop(Boolean) readonly newPage: boolean | undefined;
  @Prop(String) readonly icon: string | undefined;

  $refs!: {
    button: HTMLButtonElement;
  };

  mounted() {
    new MDCRipple(this.$refs.button);
  }
}
</script>

<style lang="scss">
@use "@material/button";

@include button.core-styles;

.mdc-button {
  @include button.shape-radius(50%);
  @include button.horizontal-padding(16px);
  @include button.height(36px);
}
</style>
