<template>
  <button
    ref="button"
    class="mdc-button mdc-button--raised"
    @click="$emit('click', arguments)"
    v-if="href"
  >
    <div class="mdc-button__ripple"></div>
    <i class="material-icons mdc-button__icon" aria-hidden="true" v-if="icon">{{
      icon
    }}</i>
    <span class="mdc-button__label">{{ text }}</span>
  </button>
  <a
    ref="button"
    class="mdc-button mdc-button--raised"
    @click="$emit('click', arguments)"
    v-else
  >
    <div class="mdc-button__ripple"></div>
    <i class="material-icons mdc-button__icon" aria-hidden="true" v-if="icon">{{
      icon
    }}</i>
    <span class="mdc-button__label">{{ text }}</span>
  </a>
</template>

<script lang="ts">
import { MDCRipple } from "@material/ripple";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MDCButton extends Vue {
  @Prop(String) readonly text: string | undefined;
  @Prop(String) readonly href: string | undefined;
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
// @import "@material/button";

// @include button.core-styles;

.mdc-button {
  // @include mdc-button-horizontal-padding(16px);
  // @include mdc-button-shape-radius(50%);

  text-align: center;
}
</style>
