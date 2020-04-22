<template>
  <button
    ref="button"
    class="mdc-icon-button material-icons-outlined"
    @click="$emit('click', arguments)"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { MDCRipple } from "@material/ripple";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MDCIconButton extends Vue {
  @Prop(String) readonly type: string | undefined;
  @Prop(String) readonly text: string | undefined;
  @Prop(String) readonly href: string | undefined;
  @Prop(Boolean) readonly newPage: boolean | undefined;
  @Prop(String) readonly icon: string | undefined;

  $refs!: {
    button: HTMLButtonElement;
  };

  mounted() {
    const iconButtonRipple = new MDCRipple(this.$refs.button);
    iconButtonRipple.unbounded = true;
  }
}
</script>

<style lang="scss">
@use "@material/icon-button";
@import "assets/scss/global";

@include icon-button.core-styles;

.material-icons-outlined {
  @include secondary-text-auto;

  transform: rotate(0.03deg);
}
</style>
