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
          href="https://github.com/Calvin-LL/secretdrop.io"
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

<style lang="scss">
@use "assets/scss/global";

#footer {
  @include global.dark-background-auto;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 48px;

  & > .content {
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

    & > .copyright-notice {
      @include global.secondary-text-auto;

      flex: 1;
      flex-shrink: 0;

      @media (max-width: 680px) {
        order: 3;
        justify-content: center;
        text-align: center;
      }
    }

    & > .personal-logo-link {
      @media (max-width: 680px) {
        order: 1;
      }

      & > svg {
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

    & > .links {
      flex: 1;
      flex-shrink: 0;
      display: flex;
      justify-content: flex-end;
      flex-flow: wrap;

      @media (max-width: 680px) {
        order: 2;
        justify-content: center;
      }

      & > a {
        @include global.secondary-text-auto;

        text-align: center;
        flex-shrink: 0;
        margin: 16px;
      }

      & > .github-link {
        @media (max-width: 369px) {
          margin-top: 0px;
          margin-bottom: 34px;
        }

        & > svg {
          width: 1rem;
          fill: global.$secondary-text-color;

          @media (prefers-color-scheme: dark) {
            fill: global.$secondary-text-color-dark;
          }
        }
      }
    }
  }
}
</style>
