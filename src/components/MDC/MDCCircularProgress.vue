<template>
  <!-- from https://github.com/material-components/material-components-web/tree/master/packages/mdc-circular-progress -->
  <div
    ref="circularProgress"
    class="mdc-circular-progress mdc-circular-progress--large mdc-circular-progress--indeterminate"
    role="progressbar"
  >
    <div class="mdc-circular-progress__determinate-container">
      <svg
        class="mdc-circular-progress__determinate-circle-graphic"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          class="mdc-circular-progress__determinate-circle"
          cx="24"
          cy="24"
          r="18"
          stroke-dasharray="113.097"
          stroke-dashoffset="113.097"
        />
      </svg>
    </div>
    <div class="mdc-circular-progress__indeterminate-container">
      <!-- prettier-ignore -->
      <div class="mdc-circular-progress__spinner-layer">
        <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__gap-patch">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
          <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MDCCircularProgress } from "@material/circular-progress";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CircularLoadingIndicator extends Vue {
  $refs!: {
    circularProgress: HTMLDivElement;
  };

  mounted() {
    new MDCCircularProgress(this.$refs.circularProgress);
  }
}
</script>

<style lang="scss">
@use "@material/circular-progress";
@use "@material/circular-progress/mdc-circular-progress";
@use "assets/scss/global";

.mdc-circular-progress {
  @include circular-progress.color(global.$theme-color);
}
</style>
