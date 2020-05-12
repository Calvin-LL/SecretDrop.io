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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class MDCIconButton extends Vue {
  @Prop(String) readonly type: string | undefined;
  @Prop(String) readonly text: string | undefined;
  @Prop(String) readonly href: string | undefined;
  @Prop(Boolean) readonly newPage: boolean | undefined;
  @Prop(String) readonly icon: string | undefined;
  @Prop(Boolean) readonly visibility: boolean | undefined;

  $refs!: {
    button: HTMLButtonElement;
  };

  iconButtonRipple: MDCRipple | undefined;

  mounted() {
    this.iconButtonRipple = new MDCRipple(this.$refs.button);
    this.iconButtonRipple.unbounded = true;
  }

  @Watch("visibility")
  onVisibilityChange() {
    if (this.visibility) this.iconButtonRipple?.layout();
  }
}
</script>

<style lang="scss">
@use "@material/icon-button";
@use "assets/scss/global";

@include icon-button.core-styles;

.material-icons-outlined {
  @include global.secondary-text-auto;

  transform: rotate(0.03deg);
}
</style>
