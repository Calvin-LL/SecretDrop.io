import "../common/modules/Header/header";

import { animateAddTextTnElement, downloadAsTxt } from "../common/typescript/Helpers";

import { MDCRipple } from "@material/ripple";
import { MDCSnackbar } from "@material/snackbar";
import PlainMessage from "../common/typescript/PlainMessage";
import PublicKey from "../common/typescript/PublicKey";
import autosize from "autosize";
import copy from "copy-to-clipboard";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// --------- begin init key ---------
let messageLimit = 0;
const publicKeyString = window.location.search.replace("?key=", "");
const publicKey = new PublicKey(publicKeyString);
const errorOverlay = $("#error-overlay") as HTMLDivElement;
const errorOverlayIcon = $("#error-overlay .swal2-icon") as HTMLDivElement;
const errorOverlayText = $("#error-overlay .error-text") as HTMLDivElement;
const loadingOverlay = $("#loading-key-overlay") as HTMLDivElement;
const loadingText = $("#loading-text") as HTMLDivElement;
const encryptingText = $("#encrypting-text") as HTMLDivElement;

if (publicKeyString.length > 0)
  publicKey
    .init()
    .then(() => {
      messageLimit = publicKey.getMaxStringLength();
      onMessageTextareaInput();
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
else onInvalidKey(new Error());

function onInvalidKey(e?: Error) {
  loadingOverlay.classList.add("hide");
  setTimeout(() => {
    loadingText.classList.add("gone");
    loadingOverlay.classList.add("gone");
    errorOverlay.classList.remove("gone");
    errorOverlayIcon.classList.add("swal2-icon-show");
  }, 300);
}
// --------- end init key ---------

// --------- begin init material web components ---------
$$(".mdc-button").forEach(element => MDCRipple.attachTo(element));
$$(".mdc-icon-button").forEach(element => (MDCRipple.attachTo(element).unbounded = true));
// --------- end init material web components ---------

const messageTextarea = $("#textarea-container > textarea") as HTMLTextAreaElement;
const messageLimitText = $("#message-limit") as HTMLDivElement;
const encryptButton = $("#encrypt-message-button") as HTMLButtonElement;
const encryptedMessageContainer = $("#encrypted-message-container") as HTMLDivElement;
const encryptedMessageTextarea = $("#encrypted-message-container > textarea") as HTMLTextAreaElement;
const successSnackbar = MDCSnackbar.attachTo($("#copy-success-snackbar") as HTMLDivElement);
const failedSnackbar = MDCSnackbar.attachTo($("#copy-failed-snackbar") as HTMLDivElement);

// --------- begin textarea ---------

autosize(messageTextarea);
messageTextarea.addEventListener("input", onMessageTextareaInput);

function onMessageTextareaInput() {
  const compressedLength = publicKey.getCompressedStringLength(messageTextarea.value);
  const isNotStringEncryptable = compressedLength > messageLimit;
  messageLimitText.innerHTML = `${compressedLength}/${messageLimit}`;

  messageLimitText.classList.toggle("warning", isNotStringEncryptable);

  encryptButton.disabled = isNotStringEncryptable;
}
// --------- end textarea ---------

// --------- begin encrypt button ---------

autosize(encryptedMessageTextarea);
encryptButton.addEventListener("click", encryptMessage);

function encryptMessage() {
  const plainMessage = new PlainMessage(messageTextarea.value, publicKey);

  encryptedMessageTextarea.value = "";
  autosize.update(encryptedMessageTextarea);

  encryptedMessageContainer.classList.remove("hide");
  encryptingText.classList.remove("gone");
  loadingOverlay.classList.remove("hide");
  loadingOverlay.classList.remove("gone");

  plainMessage
    .encrypt()
    .then(encryptedMessage => {
      showEncryptedMessage(encryptedMessage);
    })
    .catch(alert);
}

function showEncryptedMessage(encryptedMessage: string) {
  animateAddTextTnElement(
    encryptedMessageTextarea,
    encryptedMessage,
    1,
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
$("#download-encrypted-text-button")?.addEventListener("click", () => {
  downloadAsTxt(encryptedMessageTextarea.value, "encrypted-message.txt");
});
// --------- end download buttons ---------

// --------- begin copy buttons ---------

$("#copy-encrypted-text-button")?.addEventListener("click", () => {
  if (copy(encryptedMessageTextarea.value)) successSnackbar.open();
  else failedSnackbar.open();
});
// --------- end copy buttons ---------
