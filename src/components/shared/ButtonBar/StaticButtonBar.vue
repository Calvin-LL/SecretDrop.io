<template>
  <div class="botton-bar">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use "@/scss/global";
@use "@/scss/transitions";

.botton-bar {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
</style>
