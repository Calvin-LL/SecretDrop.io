<template>
  <div id="top-bar">
    <div class="content" :class="{ wrapped: headerWrapped }">
      <a
        class="logo-with-text-a"
        href="https://secretdrop.io"
        rel="noopener noreferrer"
      >
        <div class="logo-with-text">
          <AnimatedLogo class="animate-on-hover" />
          <span class="logo-text">SecretDrop.io</span>
        </div>
      </a>
      <div class="button-container">
        <MDCButton
          text="Generate new key pair"
          :type="generateSelected ? 'raised' : ''"
          @click="onGenerateKeyPairClick"
        />
        <MDCButton text="FAQ" @click="onFAQClick" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AnimatedLogo from "@/components/AnimatedLogo.vue";
import MDCButton from "@/components/MDCButton.vue";
import { scrollTo } from "@/UIHelpers";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    MDCButton,
    AnimatedLogo,
  },
})
export default class TopBar extends Vue {
  headerWrapped = false;
  generateSelected = false;

  get currentRoute() {
    return this.$route.name;
  }

  @Watch("currentRoute", { immediate: true })
  onCurrentRouteChange(val: string) {
    this.generateSelected = val === "GenerateKeyPair";
  }

  onGenerateKeyPairClick() {
    if (this.$route.path !== "/") this.$router.push("/");
  }

  onFAQClick() {
    scrollTo("#faq");
  }
}
</script>

<style scoped lang="scss">
@use "@material/button";
@use "@material/ripple";
@use "assets/scss/global";

#top-bar {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  margin-bottom: 48px;

  .content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: wrap;
    padding: 48px;
    padding-bottom: 0px;
    max-width: 1288px;

    @media (max-width: 420px) {
      padding: 4%;
      padding-top: 36px;
      padding-bottom: 0px;
    }

    @media (max-width: 740px) {
      flex-direction: column;
      justify-content: center;

      .button-container {
        margin-top: 16px;

        flex-direction: column;
      }
    }

    .logo-with-text-a {
      @include global.primary-text-auto;

      text-decoration: none;

      .logo-with-text {
        display: flex;
        justify-content: center;
        align-items: center;

        &::v-deep .animated-logo {
          width: 70px;
          transform: rotate(-5deg);
        }

        .logo-text {
          font-size: 2rem;
          font-weight: 300;
          margin-left: 16px;
        }
      }
    }

    .button-container {
      display: flex;
      justify-content: center;
      align-items: center;

      &::v-deep .mdc-button {
        margin: 8px;

        &.mdc-button--raised {
          @include button.container-fill-color(global.$theme-color);
          @include button.ink-color(global.$primary-text-color-dark);
        }

        &:not(.mdc-button--raised) {
          @include button.ink-color(global.$theme-color);

          & > .mdc-button__ripple {
            @include ripple.states-base-color(global.$theme-color);
          }
        }
      }
    }
  }
}
</style>
