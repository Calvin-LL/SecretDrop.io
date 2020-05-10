<template>
  <button
    ref="button"
    class="mdc-fab"
    aria-label="Favorite"
    @click="$emit('click', $event)"
  >
    <div class="mdc-fab__ripple"></div>
    <span class="mdc-fab__icon material-icons-outlined"><slot></slot></span>
  </button>
</template>

<script lang="ts">
import { MDCRipple } from "@material/ripple";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MDCIconButton extends Vue {
  $refs!: {
    button: HTMLButtonElement;
  };

  @Prop(String) readonly text: string | undefined;

  mounted() {
    new MDCRipple(this.$refs.button);
  }
}
</script>

<style lang="scss">
@use "@material/fab";
@use "@material/fab/mdc-fab";
@use "assets/scss/global";

.mdc-fab {
  @include fab.container-color(global.$theme-color);
  @include fab.ink-color(global.$primary-text-color-dark);

  & > .material-icons-outlined {
    color: global.$primary-text-color-dark !important;
  }
}
</style>
