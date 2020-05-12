<template>
  <div id="full-screen-loading-overlay" :class="{ invisible, gone }">
    <AnimatedLogo class="animate" />
    <h1 class="loading-text">Generating new key pair</h1>
  </div>
</template>

<script lang="ts">
import AnimatedLogo from "@/components/shared/AnimatedLogo.vue";
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: { AnimatedLogo },
})
export default class FullScreenLoadingOverlay extends Vue {
  @Prop(Boolean) readonly hidden!: boolean;

  invisible = false;
  gone = false;

  @Watch("hidden")
  async onHiddenChange(hidden: boolean) {
    if (hidden) {
      await delay(250);
      this.invisible = true;
      await delay(250);
      this.gone = true;
    }
  }
}
</script>

<style lang="scss">
@use "assets/scss/global";

#full-screen-loading-overlay {
  @include global.absolute-overlay;

  z-index: 100;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: global.$overlay-color;

  transition-property: opacity;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  pointer-events: all;

  &.invisible {
    opacity: 0;
  }

  &.gone {
    display: none;
  }

  .loading-text {
    color: white;
    font-weight: 400;
    text-align: center;
    font-size: 2em;

    @media (max-width: 640px) {
      font-size: 1.3em;
    }
  }

  .animated-logo {
    width: 170px;
    width: min(170px, 30%);
  }
}
</style>
