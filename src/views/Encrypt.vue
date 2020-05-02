<template>
  <div class="encrypt">
    <Card
      class="encrypt-card"
      title="Encrypt"
      subtitle="Only the person who has the decryption link can decrypt your message or file. Everything is done on this device. This page also works offline."
    >
      <div class="textarea-container">
        <textarea autofocus placeholder="Enter your message here"></textarea>
      </div>
      <FileDrop
        text="Drop files here or click here to select files to encrypt"
        dropText="Drop to encrypt"
      />
    </Card>
  </div>
</template>

<script lang="ts">
import Card from "@/components/Card.vue";
import FileDrop from "@/components/FileDrop.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: { Card, FileDrop },
})
export default class Encrypt extends Vue {}
</script>

<style scoped lang="scss">
@import "assets/scss/global";

.encrypt {
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .encrypt-card {
    background-color: #f1f8e9;

    @media (prefers-color-scheme: dark) {
      background-color: #273a12;
    }

    .textarea-container {
      max-height: 100vh;

      padding-left: 8px;
      padding-right: 8px;
      padding-bottom: 8px;

      will-change: max-height;

      transition-property: all;
      transition-duration: 250ms;
      transition-timing-function: ease-in-out;

      &.hide {
        max-height: 0px;
        visibility: hidden;
      }

      &.gone {
        display: none;
      }

      textarea {
        @include primary-text-auto;

        width: 100%;
        height: 100px;

        resize: none;
        border: none;
        outline: none;
        overflow-y: hidden;

        padding: 0px;

        background-color: transparent;

        font-size: 1.2rem;
        font-family: Roboto Slab, serif;

        &::placeholder {
          @include secondary-text-auto;
        }
      }
    }
  }
}
</style>
