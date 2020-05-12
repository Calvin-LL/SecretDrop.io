<template>
  <div class="card-title-container">
    <h2 class="title" v-if="title">{{ title }}</h2>
    <div class="subtitle" v-if="subtitle"><span v-html="subtitle"></span></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CardTitle",
  props: {
    title: String,
    subtitle: String,
  },
});
</script>

<style lang="scss">
@use "assets/scss/global";

.card-title-container {
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  margin-bottom: 16px;
  padding-left: 8px;
  padding-right: 8px;

  & > .title {
    font-weight: 500;
    margin: 0px;
    margin-bottom: 4px;
  }

  & > .subtitle {
    @include global.secondary-text-auto;

    & .warning {
      color: #d50000;

      @media (prefers-color-scheme: dark) {
        color: #ff7070;
      }
    }
  }
}
</style>
