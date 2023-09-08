<script setup lang="ts">
import CardErrorBoundary from "@/components/shared/CardErrorBoundary/CardErrorBoundary.vue";
import LinkCardContent from "./LinkCardContent.vue";
import { privateKeyString } from "./keyPairStore";
</script>

<template>
  <CardErrorBoundary>
    <LinkCardContent cardType="decrypt" :key-string="privateKeyString" />
  </CardErrorBoundary>
</template>
