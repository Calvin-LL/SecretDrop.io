<template>
  <div class="swal2-icon swal2-error" :class="{ 'swal2-icon-show': show }">
    <span class="swal2-x-mark">
      <span class="swal2-x-mark-line-left"></span>
      <span class="swal2-x-mark-line-right"></span>
    </span>
  </div>
</template>

<script lang="ts">
import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class ErrorIcon extends Vue {
  @Prop(Boolean) readonly show!: boolean;
}
</script>

<style lang="scss">
$swal2-icon-size: 5em;
$swal2-icon-margin: 1.25em auto 1.875em;
$swal2-error: #f27474;

.swal2-icon {
  position: relative;
  box-sizing: content-box;
  justify-content: center;
  width: $swal2-icon-size;
  height: $swal2-icon-size;
  margin: $swal2-icon-margin;
  border: 0.25em solid transparent;
  border-radius: 50%;
  line-height: $swal2-icon-size;
  cursor: default;
  user-select: none;
  display: none;
  zoom: 1.5;

  &.swal2-error {
    border-color: $swal2-error;
    color: $swal2-error;

    .swal2-x-mark {
      position: relative;
      flex-grow: 1;
    }

    [class^="swal2-x-mark-line"] {
      display: block;
      position: absolute;
      top: 2.3125em;
      width: 2.9375em;
      height: 0.3125em;
      border-radius: 0.125em;
      background-color: $swal2-error;

      &[class$="left"] {
        left: 1.0625em;
        transform: rotate(45deg);
      }

      &[class$="right"] {
        right: 1em;
        transform: rotate(-45deg);
      }
    }

    // Error icon animation
    &.swal2-icon-show {
      display: flex;
      animation: swal2-animate-error-icon 0.5s;

      .swal2-x-mark {
        animation: swal2-animate-error-x-mark 0.5s;
      }
    }
  }
}

@keyframes swal2-animate-error-x-mark {
  0% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }

  50% {
    margin-top: 1.625em;
    transform: scale(0.4);
    opacity: 0;
  }

  80% {
    margin-top: -0.375em;
    transform: scale(1.15);
  }

  100% {
    margin-top: 0;
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes swal2-animate-error-icon {
  0% {
    transform: rotateX(100deg);
    opacity: 0;
  }

  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
</style>
