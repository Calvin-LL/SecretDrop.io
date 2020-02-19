import "../common/modules/Header/header";

import { animateAddTextTnElement, downloadAsTxt } from "../common/typescript/Helpers";

import EncryptedMessage from "../common/typescript/EncryptedMessage";
import { MDCRipple } from "@material/ripple";
import { MDCSnackbar } from "@material/snackbar";
import PrivateKey from "../common/typescript/PrivateKey";
import autosize from "autosize";
import copy from "copy-to-clipboard";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// --------- begin init key ---------
const privateKeyString = window.location.search.replace("?key=", "");
const privateKey = new PrivateKey(privateKeyString);
const errorOverlay = $("#error-overlay") as HTMLDivElement;
const errorOverlayIcon = $("#error-overlay .swal2-icon") as HTMLDivElement;
const errorOverlayText = $("#error-overlay .error-text") as HTMLDivElement;
const errorOverlayDetailText = $("#error-overlay .error-detail-text") as HTMLDivElement;
const loadingOverlay = $("#loading-key-overlay") as HTMLDivElement;
const loadingText = $("#loading-text") as HTMLDivElement;
const decryptingText = $("#decrypting-text") as HTMLDivElement;

if (privateKeyString.length > 0)
  privateKey
    .init()
    .then(() => {
      loadingOverlay.classList.add("hide");
      setTimeout(() => {
        loadingText.classList.add("gone");
        loadingOverlay.classList.add("gone");
      }, 300);
    })
    .catch(e => {
      console.error(e);
      onInvalidKey();
    });
else onInvalidKey();

function onInvalidKey() {
  loadingOverlay.classList.add("hide");
  setTimeout(() => {
    loadingText.classList.add("gone");
    loadingOverlay.classList.add("gone");
    errorOverlay.classList.remove("gone");
    errorOverlayIcon.classList.add("swal2-icon-show");
  }, 250);
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

function decryptMessage() {
  if (messageTextarea.value.length > 0) {
    const encryptedMessage = new EncryptedMessage(messageTextarea.value, privateKey);
    decryptedMessageTextarea.value = "";
    autosize.update(decryptedMessageTextarea);
    decryptedMessageContainer.classList.remove("hide");
    decryptingText.classList.remove("gone");
    loadingOverlay.classList.remove("hide");
    loadingOverlay.classList.remove("gone");
    encryptedMessage
      .decrypt()
      .then(decryptedMessage => {
        showDecryptedMessage(decryptedMessage);
      })
      .catch(() => {
        onInvalidMessage();
      });
  } else onInvalidMessage();
}

function onInvalidMessage() {
  loadingOverlay.classList.add("hide");
  setTimeout(() => {
    loadingOverlay.classList.add("gone");
    errorOverlay.classList.remove("gone");
    errorOverlayIcon.classList.add("swal2-icon-show");
    errorOverlayText.innerHTML = "Invalid Message";
    errorOverlayDetailText.innerHTML =
      "Possibly not encrypted by the corresponding encryption link. Refresh to try again.";
  }, 250);
}

function showDecryptedMessage(decryptedMessage: string) {
  setTimeout(() => {
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
  }, 1000);
}
// --------- end encrypt button ---------

// --------- begin download buttons ---------
$("#download-encrypted-text-button")?.addEventListener("click", () => {
  downloadAsTxt(decryptedMessageTextarea.value, "decrypted-message.txt");
});
// --------- end download buttons ---------

// --------- begin copy buttons ---------

$("#copy-encrypted-text-button")?.addEventListener("click", () => {
  if (copy(decryptedMessageTextarea.value)) successSnackbar.open();
  else failedSnackbar.open();
});
// --------- end copy buttons ---------
