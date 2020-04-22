<template>
  <div class="card">
    <div class="title-container">
      <h2 class="title">{{ title }}</h2>
      <div class="subtitle"><span v-html="subtitle"></span></div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Card extends Vue {
  @Prop(String) readonly title: string | undefined;
  @Prop(String) readonly subtitle: string | undefined;
}
</script>

<style lang="scss">
@import "assets/scss/global";

.card {
  min-height: 100px;
  max-width: 500px;

  padding: 16px;

  border-radius: 32px;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  overflow: hidden;

  .title-container {
    width: 100%;
    box-sizing: border-box;
    margin-top: 8px;
    margin-bottom: 16px;
    padding-left: 8px;
    padding-right: 8px;

    .title {
      font-weight: 500;
      margin: 0px;
      margin-bottom: 4px;
    }

    .subtitle {
      @include secondary-text-auto;

      .warning {
        color: #d50000;

        @media (prefers-color-scheme: dark) {
          color: #ff7070;
        }
      }
    }
  }
}
</style>
