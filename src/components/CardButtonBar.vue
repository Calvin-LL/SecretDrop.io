<template>
  <div class="bottom-bar-container">
    <div class="bottom-bar">
      <MDCIconButton @click="$emit('download', $event)">
        save_alt
      </MDCIconButton>
      <MDCIconButton @click="$emit('copy', $event)">
        file_copy
      </MDCIconButton>
    </div>
  </div>
</template>

<script lang="ts">
import MDCIconButton from "@/components/MDC/MDCIconButton.vue";
import Vue from "vue";

export default Vue.extend({
  name: "LinkCard",
  components: { MDCIconButton },
});
</script>

<style lang="scss">
.bottom-bar-container {
  width: 100%;

  .bottom-bar {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
