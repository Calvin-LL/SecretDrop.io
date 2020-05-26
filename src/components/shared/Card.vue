<template>
  <div class="card">
    <CardTitle :title="title" :subtitle="subtitle" />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import CardTitle from "@/components/shared/CardTitle.vue";
import Vue from "vue";

export default Vue.extend({
  name: "Card",
  components: { CardTitle },
  props: {
    title: String,
    subtitle: String,
  },
});
</script>

<style lang="scss">
@use "assets/scss/global";

.card {
  position: relative;

  flex-basis: 470px;
  min-height: 100px;
  max-width: 470px;

  padding: 16px;
  margin-left: 48px;
  margin-right: 48px;

  border-radius: 32px;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  overflow: hidden;

  @media (max-width: 640px) {
    margin-left: 4%;
    margin-right: 4%;
  }
}
</style>
