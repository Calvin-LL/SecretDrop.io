<script setup lang="ts">
import CardErrorBoundary from "@/components/shared/CardErrorBoundary/CardErrorBoundary.vue";
import LinkCardContent from "./LinkCardContent.vue";
import { publicKeyString } from "./keyPairStore";
</script>

<template>
  <CardErrorBoundary>
    <LinkCardContent cardType="encrypt" :key-string="publicKeyString" />
  </CardErrorBoundary>
</template>
