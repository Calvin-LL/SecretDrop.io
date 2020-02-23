import "../common/modules/Header/header";

import { animateAddTextTnElement, downloadAsTxt } from "../common/typescript/Helpers";

import EncryptedMessage from "../common/typescript/EncryptedMessage";
import { MDCRipple } from "@material/ripple";
import { MDCSnackbar } from "@material/snackbar";
import PrivateKey from "../common/typescript/PrivateKey";
import autosize from "autosize";
import copy from "copy-to-clipboard";
import delay from "delay";
import isCryptoUseable from "../common/typescript/CryptoCheck";

main();

function main() {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  // --------- begin init key ---------
  const privateKeyString = window.location.search.replace("?key=", "");
  const errorOverlay = $("#error-overlay") as HTMLDivElement;
  const errorOverlayIcon = $("#error-overlay .swal2-icon") as HTMLDivElement;
  const errorOverlayText = $("#error-overlay .error-text") as HTMLDivElement;
  const errorOverlayDetailText = $("#error-overlay .error-detail-text") as HTMLDivElement;
  const loadingOverlay = $("#loading-key-overlay") as HTMLDivElement;
  const loadingText = $("#loading-text") as HTMLDivElement;
  const decryptingText = $("#decrypting-text") as HTMLDivElement;

  if (!isCryptoUseable()) return onIncompatibleBrowser();
  if (privateKeyString.length <= 0 || privateKeyString.match(/[^a-z0-9]/g) !== null) return onInvalidKey();
  const privateKey = new PrivateKey(privateKeyString);

  startLoadingAnimation();

  async function startLoadingAnimation() {
    await delay(3000);

    loadingOverlay.classList.add("hide");

    await delay(300);

    loadingText.classList.add("gone");
    loadingOverlay.classList.add("gone");
  }

  async function onInvalidKey() {
    loadingOverlay.classList.add("hide");
    errorOverlayDetailText.remove();

    await delay(250);

    loadingText.classList.add("gone");
    loadingOverlay.classList.add("gone");
    errorOverlay.classList.remove("gone");
    errorOverlayIcon.classList.add("swal2-icon-show");
  }

  async function onIncompatibleBrowser() {
    loadingOverlay.classList.add("hide");
    errorOverlayText.innerHTML = "Browser not supported";
    errorOverlayDetailText.remove();

    await delay(250);

    loadingText.classList.add("gone");
    loadingOverlay.classList.add("gone");
    errorOverlay.classList.remove("gone");
    errorOverlayIcon.classList.add("swal2-icon-show");
  }
  // --------- end init key ---------

  // --------- begin init material web components ---------
  $$(".mdc-button").forEach(element => MDCRipple.attachTo(element));
  $$(".mdc-icon-button").forEach(element => (MDCRipple.attachTo(element).unbounded = true));
  // --------- end init material web components ---------

  const messageTextarea = $("#textarea-container > textarea") as HTMLTextAreaElement;
  const decryptButton = $("#decrypt-message-button") as HTMLButtonElement;
  const decryptedMessageContainer = $("#decrypted-message-container") as HTMLDivElement;
  const decryptedMessageTextarea = $("#decrypted-message-container > textarea") as HTMLTextAreaElement;
  const successSnackbar = MDCSnackbar.attachTo($("#copy-success-snackbar") as HTMLDivElement);
  const failedSnackbar = MDCSnackbar.attachTo($("#copy-failed-snackbar") as HTMLDivElement);

  // --------- begin textarea ---------

  autosize(messageTextarea);

  // --------- end textarea ---------

  // --------- begin encrypt button ---------

  autosize(decryptedMessageTextarea);
  decryptButton.addEventListener("click", decryptMessage);

  async function decryptMessage() {
    if (messageTextarea.value.length <= 0) return onInvalidMessage();

    const encryptedMessage = new EncryptedMessage(messageTextarea.value, privateKey);

    decryptedMessageTextarea.value = "";
    autosize.update(decryptedMessageTextarea);
    decryptedMessageContainer.classList.remove("hide");
    decryptingText.classList.remove("gone");
    loadingOverlay.classList.remove("hide");
    loadingOverlay.classList.remove("gone");

    try {
      const decryptedMessage = await encryptedMessage.decrypt();
      showDecryptedMessage(decryptedMessage);
    } catch (e) {
      console.error(e);
      onInvalidMessage();
    }
  }

  async function onInvalidMessage() {
    loadingOverlay.classList.add("hide");

    await delay(250);

    loadingOverlay.classList.add("gone");
    errorOverlay.classList.remove("gone");
    errorOverlayIcon.classList.add("swal2-icon-show");
    errorOverlayText.innerHTML = "Invalid Message";
    errorOverlayDetailText.innerHTML =
      "Possibly not encrypted by the corresponding encryption link. Refresh to try again.";
  }

  async function showDecryptedMessage(decryptedMessage: string) {
    await delay(1000);

    animateAddTextTnElement(
      decryptedMessageTextarea,
      decryptedMessage,
      1000,
      "value",
      () => {
        autosize.update(decryptedMessageTextarea);
      },
      () => {
        loadingOverlay.classList.add("hide");
        setTimeout(() => {
          decryptedMessageTextarea.focus();
          loadingOverlay.classList.add("gone");
        }, 300);
      }
    );
  }
  // --------- end encrypt button ---------

  // --------- begin download buttons ---------
  $(".download-button")?.addEventListener("click", () => {
    downloadAsTxt(decryptedMessageTextarea.value, "decrypted-message.txt");
  });
  // --------- end download buttons ---------

  // --------- begin copy buttons ---------

  $(".copy-button")?.addEventListener("click", () => {
    if (copy(decryptedMessageTextarea.value)) successSnackbar.open();
    else failedSnackbar.open();
  });
  // --------- end copy buttons ---------
}
