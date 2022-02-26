<script setup lang="ts">
import Button from "@/components/shared/Button.vue";
import AnimatedLogo from "@/components/shared/AnimatedLogo.vue";
</script>

<template>
  <div id="top-bar">
    <div class="content">
      <header>
        <router-link class="logo-with-text" :to="{ path: '/' }" exact>
          <AnimatedLogo width="70px" animate-on-hover tilted />
          <span class="logo-text">SecretDrop.io</span>
        </router-link>
      </header>
      <nav class="button-container">
        <Button text="Generate new key pair" :to="{ path: '/' }" raised />
        <Button text="FAQ" text-color="vivid" />
      </nav>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/scss/global";
@use "@/scss/colors";

#top-bar {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  margin-bottom: 48px;

  & > .content {
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

    & > header > .logo-with-text {
      all: unset;

      @include global.primary-text-auto;

      cursor: pointer;

      display: flex;
      justify-content: center;
      align-items: center;

      &:focus-visible {
        outline-color: colors.$theme-color;
        outline-width: 2px;
        outline-style: solid;
        outline-offset: 8px;
      }

      & > .logo-text {
        font-size: 2rem;
        font-weight: 300;
        margin-left: 16px;
      }
    }

    & > .button-container {
      display: flex;
      justify-content: center;
      align-items: center;

      & > .button {
        margin: 8px;
      }
    }
  }
}
</style>
