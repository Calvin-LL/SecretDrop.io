<script setup lang="ts">
import logoSwingSvg from "@/assets/logo-swing.svg";
import logoTiledSwingHoverSvg from "@/assets/logo-tiled-swing-hover.svg";

defineProps<{
  type: "tiled-animate-on-hover" | "animated";
}>();
</script>

<template>
  <object
    type="image/svg+xml"
    :data="
      type === 'tiled-animate-on-hover'
        ? logoTiledSwingHoverSvg.src
        : logoSwingSvg.src
    "
  />
</template>
