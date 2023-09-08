<script setup lang="ts">
import CollapseTransition from "@/components/shared/CollapseTransition.vue";
import { ref } from "vue";

defineProps<{
  hidden?: boolean;
}>();

const root = ref<HTMLDivElement>();
</script>

<template>
  <CollapseTransition :element="root" :elementVisible="!hidden">
    <div v-show="!hidden" ref="root" class="or-p">or</div>
  </CollapseTransition>
</template>

<style lang="scss" scoped>
@use "@/scss/global";
@use "@/scss/transitions";

.or-p {
  @include global.secondary-text-auto;

  text-align: center;
  font-size: 1rem;
  line-height: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  max-height: 3rem;

  overflow: hidden;
}
</style>
