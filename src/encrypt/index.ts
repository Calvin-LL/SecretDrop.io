import "../common/modules/Header/header";

import { animateAddTextTnElement, downloadAsTxt } from "../common/typescript/Helpers";

import { MDCRipple } from "@material/ripple";
import { MDCSnackbar } from "@material/snackbar";
import PlainMessage from "../common/typescript/PlainMessage";
import PublicKey from "../common/typescript/PublicKey";
import autosize from "autosize";
import copy from "copy-to-clipboard";
import delay from "delay";
import isCryptoUseable from "../common/typescript/CryptoCheck";

main();

function main() {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  // --------- begin init key ---------
  const publicKeyString = window.location.search.replace("?key=", "");
  const errorOverlay = $("#error-overlay") as HTMLDivElement;
  const errorOverlayIcon = $("#error-overlay .swal2-icon") as HTMLDivElement;
  const errorOverlayText = $("#error-overlay .error-text") as HTMLDivElement;
  const loadingOverlay = $("#loading-key-overlay") as HTMLDivElement;
  const loadingText = $("#loading-text") as HTMLDivElement;
  const encryptingText = $("#encrypting-text") as HTMLDivElement;

  if (!isCryptoUseable()) return onIncompatibleBrowser();
  if (publicKeyString.length <= 0 || publicKeyString.match(/[^a-z0-9]/g) !== null) return onInvalidKey();

  const publicKey = new PublicKey(publicKeyString);

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

    await delay(250);

    loadingText.classList.add("gone");
    loadingOverlay.classList.add("gone");
    errorOverlay.classList.remove("gone");
    errorOverlayIcon.classList.add("swal2-icon-show");
  }

  async function onIncompatibleBrowser() {
    loadingOverlay.classList.add("hide");
    errorOverlayText.innerHTML = "Browser not supported";

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
  const encryptButton = $("#encrypt-message-button") as HTMLButtonElement;
  const encryptedMessageContainer = $("#encrypted-message-container") as HTMLDivElement;
  const encryptedMessageTextarea = $("#encrypted-message-container > textarea") as HTMLTextAreaElement;
  const successSnackbar = MDCSnackbar.attachTo($("#copy-success-snackbar") as HTMLDivElement);
  const failedSnackbar = MDCSnackbar.attachTo($("#copy-failed-snackbar") as HTMLDivElement);

  autosize(messageTextarea);

  autosize(encryptedMessageTextarea);

  // --------- begin encrypt button ---------
  encryptButton.addEventListener("click", encryptMessage);

  async function encryptMessage() {
    const plainMessage = new PlainMessage(messageTextarea.value, publicKey);

    encryptedMessageTextarea.value = "";
    autosize.update(encryptedMessageTextarea);

    encryptedMessageContainer.classList.remove("hide");
    encryptingText.classList.remove("gone");
    loadingOverlay.classList.remove("hide");
    loadingOverlay.classList.remove("gone");

    try {
      const encryptedMessage = await plainMessage.encrypt();
      showEncryptedMessage(encryptedMessage);
    } catch (e) {
      alert("Error");
      console.error(e);
    }
  }

  async function showEncryptedMessage(encryptedMessage: string) {
    await delay(1000);

    animateAddTextTnElement(
      encryptedMessageTextarea,
      encryptedMessage,
      1000,
      "value",
      () => {
        autosize.update(encryptedMessageTextarea);
      },
      () => {
        encryptedMessageTextarea.select();
        loadingOverlay.classList.add("hide");
        setTimeout(() => {
          loadingOverlay.classList.add("gone");
        }, 300);
      }
    );
  }
  // --------- end encrypt button ---------

  // --------- begin download buttons ---------
  $(".download-button")?.addEventListener("click", () => {
    downloadAsTxt(encryptedMessageTextarea.value, "encrypted-message.txt");
  });
  // --------- end download buttons ---------

  // --------- begin copy buttons ---------

  $(".copy-button")?.addEventListener("click", () => {
    if (copy(encryptedMessageTextarea.value)) successSnackbar.open();
    else failedSnackbar.open();
  });
  // --------- end copy buttons ---------
}
