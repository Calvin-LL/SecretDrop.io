<template>
  <div ref="snackbar" class="mdc-snackbar">
    <div class="mdc-snackbar__surface">
      <div class="mdc-snackbar__label" role="status" aria-live="polite">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MDCSnackbar } from "@material/snackbar";
import delay from "delay";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MDCSnackBar extends Vue {
  $refs!: {
    snackbar: HTMLDivElement;
  };

  message = "";

  mounted() {
    const snackbar = new MDCSnackbar(this.$refs.snackbar);

    this.$root.$on("show-snackbar", (msg: string) => {
      if (snackbar.isOpen) {
        const openSnackbar = async () => {
          snackbar.unlisten("MDCSnackbar:closed", openSnackbar);
          this.message = msg;
          await delay(100);
          snackbar.open();
        };

        snackbar.listen("MDCSnackbar:closed", openSnackbar);

        snackbar.close();
      } else {
        this.message = msg;
        snackbar.open();
      }
    });
  }
}
</script>

<style lang="scss">
@use "@material/snackbar/mdc-snackbar";
</style>
