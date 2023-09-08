<script setup lang="ts">
import Button from "@/components/shared/Button.vue";
import { scrollTo } from "@/helpers";

function scrollToFaq() {
  scrollTo("#faq");
}
</script>

<template>
  <Button
    text="FAQ"
    text-color="vivid"
    tinted-background
    @click="scrollToFaq"
  />
</template>
