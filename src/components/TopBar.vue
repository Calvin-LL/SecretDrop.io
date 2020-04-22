<template>
  <div id="top-bar">
    <div class="content" :class="{ wrapped: headerWrapped }">
      <a
        class="logo-with-text-a"
        href="https://secretdrop.io"
        rel="noopener noreferrer"
      >
        <div ref="logoContainer" class="logo-with-text">
          <AnimatedLogo />
          <span class="logo-text">SecretDrop.io</span>
        </div>
      </a>
      <div ref="buttonContainer" class="button-container">
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { scrollTo } from "@/UIHelpers";

@Component({
  components: {
    MDCButton,
    AnimatedLogo,
  },
})
export default class TopBar extends Vue {
  $refs!: {
    logoContainer: HTMLDivElement;
    buttonContainer: HTMLDivElement;
  };

  headerWrapped = false;
  generateSelected = false;

  get currentRoute() {
    return this.$route.name;
  }

  mounted() {
    window.addEventListener("resize", this.resizeHeader);
    this.resizeHeader();
  }

  resizeHeader() {
    const logoBottom =
      (this.$refs.logoContainer.offsetTop ?? 0) +
      (this.$refs.logoContainer.offsetHeight ?? 0);
    const buttonTop = this.$refs.buttonContainer.offsetTop ?? 0;

    this.headerWrapped = logoBottom <= buttonTop;
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
@import "assets/scss/global";

#top-bar {
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: wrap;
    padding: 48px;
    padding-bottom: 0px;
    max-width: 1800px;
    width: 1288px;

    &.wrapped {
      justify-content: center;

      .button-container {
        margin-top: 16px;
      }
    }

    .logo-with-text-a {
      margin-right: 32px;
      text-decoration: none;
      color: $primary-text-color;

      @media (prefers-color-scheme: dark) {
        color: $primary-text-color-dark;
      }

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
      flex-flow: wrap;

      &::v-deep .mdc-button {
        margin: 8px;

        &.mdc-button--raised {
          @include button.container-fill-color(#43a047);
          @include button.ink-color($primary-text-color-dark);
        }

        &:not(.mdc-button--raised) {
          @include button.ink-color(#43a047);

          & > .mdc-button__ripple {
            @include ripple.states-base-color(#43a047);
          }
        }
      }
    }
  }
}
</style>
