<template>
  <div id="footer">
    <div class="content">
      <div class="copyright-notice">Copyright © 2020 Calvin Liang</div>
      <a
        href="https://calvin.sh"
        target="_blank"
        class="personal-logo-link"
        rel="noopener noreferrer"
      >
        <img svg-inline src="@/assets/images/personal-logo.svg" />
      </a>
      <div class="links">
        <a
          class="personal-link"
          href="https://calvin.sh"
          target="_blank"
          rel="noopener noreferrer"
          >My Website</a
        >
        <a
          class="github-link"
          href="https://github.com/CoolCyberBrain/secretdrop.io"
          target="_blank"
          rel="noopener noreferrer"
          >View on Github
          <img svg-inline src="@/assets/images/github-logo.svg" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Footer",
});
</script>

<style scoped lang="scss">
@import "assets/scss/global";

#footer {
  background-color: $dark-background;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 48px;

  @media (prefers-color-scheme: dark) {
    background-color: $dark-background-dark;
  }

  .content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: wrap;
    padding: 48px;
    max-width: 1288px;

    @media (max-width: 680px) {
      flex-direction: column;
    }

    .copyright-notice {
      flex: 1;
      flex-shrink: 0;
      color: $secondary-text-color;

      @media (prefers-color-scheme: dark) {
        color: $secondary-text-color-dark;
      }

      @media (max-width: 680px) {
        order: 3;
        justify-content: center;
        text-align: center;
      }
    }

    .personal-logo-link {
      @media (max-width: 680px) {
        order: 1;
      }

      svg {
        width: 2rem;
        filter: grayscale(100%);
        transition-property: all;
        transition-duration: 500ms;
        transition-timing-function: ease-in-out;

        &:hover {
          filter: unset;
        }
      }
    }

    .links {
      flex: 1;
      flex-shrink: 0;
      display: flex;
      justify-content: flex-end;
      flex-flow: wrap;

      @media (max-width: 680px) {
        order: 2;
        justify-content: center;
      }

      a {
        text-align: center;
        flex-shrink: 0;
        margin: 16px;
        color: $secondary-text-color;

        @media (prefers-color-scheme: dark) {
          color: $secondary-text-color-dark;
        }
      }

      .github-link {
        @media (max-width: 369px) {
          margin-top: 0px;
          margin-bottom: 34px;
        }

        svg {
          width: 1rem;
          fill: $secondary-text-color;

          @media (prefers-color-scheme: dark) {
            fill: $secondary-text-color-dark;
          }
        }
      }
    }
  }
}
</style>
