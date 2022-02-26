import { nextTick, ref } from "vue";

const snackBarMessage = ref<string>();

export async function showSnackBar(message: string): Promise<void> {
  snackBarMessage.value = undefined;

  await nextTick();

  snackBarMessage.value = message;

  setTimeout(() => {
    // only clear snackbar if it's still the same message
    if (snackBarMessage.value === message) {
      snackBarMessage.value = undefined;
    }
  }, 5000);
}
