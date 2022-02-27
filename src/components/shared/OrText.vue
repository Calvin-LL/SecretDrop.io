<script setup lang="ts">
defineProps<{
  show?: boolean;
}>();
</script>

<template>
  <Transition name="collapse">
    <div v-if="show" class="or-p">or</div>
  </Transition>
</template>

<style lang="scss">
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
  contain: content;
}
</style>
