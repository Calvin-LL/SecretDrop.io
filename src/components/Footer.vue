<script setup lang="ts">
import personalLogoSvg from "@/assets/personal-logo.svg?raw";
import githubLogoSvg from "@/assets/github-logo.svg?raw";
</script>

<template>
  <div id="footer">
    <div class="content">
      <div class="copyright-notice">Copyright © 2020 Calvin Liang</div>
      <!-- eslint-disable vue/no-v-html -->
      <a
        href="https://calvin.sh"
        target="_blank"
        class="personal-logo-link"
        rel="noopener noreferrer"
        v-html="personalLogoSvg"
      />
      <div class="links">
        <a
          class="personal-link"
          href="https://calvin.sh"
          target="_blank"
          rel="noopener noreferrer"
          >My Website</a
        >
        <!-- eslint-disable vue/no-v-html -->
        <a
          class="github-link"
          href="https://github.com/Calvin-LL/secretdrop.io"
          target="_blank"
          rel="noopener noreferrer"
          >View on Github&emsp;<span v-html="githubLogoSvg" />
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/scss/global";
@use "@/scss/colors";

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
        @media (max-width: 380px) {
          margin-top: 0px;
          margin-bottom: 34px;
        }

        & > span {
          margin-left: -0.9rem;

          & > svg {
            width: 1rem;

            fill: colors.$secondary-text-color;

            @media (prefers-color-scheme: dark) {
              fill: colors.$secondary-text-color-dark;
            }
          }
        }
      }
    }
  }
}
</style>
