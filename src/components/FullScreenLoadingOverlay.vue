<template>
  <div id="full-screen-loading-overlay" :class="{ invisible, gone }">
    <AnimatedLogo class="animate" />
    <h1 class="loading-text">Generating new key pair</h1>
  </div>
</template>

<script lang="ts">
import AnimatedLogo from "@/components/AnimatedLogo.vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  components: { AnimatedLogo },
})
export default class FullScreenLoadingOverlay extends Vue {
  @Prop(Boolean) readonly hide!: boolean;

  invisible = false;
  gone = false;

  @Watch("hide")
  onHideChange(hide: boolean) {
    if (hide)
      setTimeout(() => {
        this.invisible = true;

        setTimeout(() => {
          this.gone = true;
        }, 250);
      }, 250);
  }
}
</script>

<style lang="scss">
#full-screen-loading-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: rgba($color: #000000, $alpha: 0.4);

  transition-property: opacity, visibility;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;

  pointer-events: all;

  &.invisible {
    opacity: 0;
    visibility: hidden;
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
