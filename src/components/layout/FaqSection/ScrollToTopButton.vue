<script setup lang="ts">
import Button from "@/components/shared/Button.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

const show = ref(false);

onMounted(() => {
  window.addEventListener("scroll", onWindowScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onWindowScroll);
});

function onWindowScroll() {
  const el = document.getElementById("faq");
  const position = el?.getBoundingClientRect();
  const top = position?.top ?? 0;
  const scrollTop = document.documentElement.scrollTop;

  show.value = top < window.innerHeight / 2 && scrollTop > 100;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}
</script>

<template>
  <Transition>
    <div v-show="show" class="button-container">
      <Button
        button-style="fab"
        icon="keyboard_arrow_up"
        aria-label="Scroll to top"
        @click="scrollToTop"
      />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use "@/scss/transitions";

.button-container {
  position: fixed;
  z-index: 10;
  bottom: 1rem;
  right: 1rem;

  bottom: max(1rem, env(safe-area-inset-bottom));
  right: max(1rem, env(safe-area-inset-right));

  @media (min-width: 1024px) {
    bottom: 1.5rem;
    right: 1.5rem;

    bottom: max(1.5rem, env(safe-area-inset-bottom));
    right: max(1.5rem, env(safe-area-inset-right));
  }

  &.v-enter-active {
    transition-property: transform, opacity;
    transition-duration: transitions.$transition-duration-tiny;
    transition-timing-function: transitions.$transition-timing-function-deceleration;
  }

  &.v-leave-active {
    transition-property: transform, opacity;
    transition-duration: transitions.$transition-duration-tiny;
    transition-timing-function: transitions.$transition-timing-function-acceleration;
  }

  &.v-enter-from,
  &.v-leave-to {
    transform: scale(0);
    opacity: 0;
  }
}
</style>
