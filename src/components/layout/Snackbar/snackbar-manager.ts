import { ref } from "vue";

import { delay } from "@/helpers";

export const AUTO_DISMISS_TIMEOUT_MS = 5000;
export const SNACKBAR_ANIMATION_CLOSE_TIME_MS = 75;
export const SNACKBAR_ANIMATION_OPEN_TIME_MS = 150;

export const snackbarMessage = ref<string>();

let timeoutId: number | undefined;

export async function showSnackbar(message: string): Promise<void> {
  if (timeoutId) {
    clearTimeout(timeoutId);

    timeoutId = undefined;
  }

  if (snackbarMessage.value) {
    snackbarMessage.value = undefined;

    await delay(SNACKBAR_ANIMATION_CLOSE_TIME_MS);
  }

  snackbarMessage.value = message;

  timeoutId = setTimeout(() => {
    snackbarMessage.value = undefined;
  }, 5000) as unknown as number;
}
