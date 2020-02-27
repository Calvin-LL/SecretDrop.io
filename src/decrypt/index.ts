import "../common/modules/Header/header";

import {
  animateAddTextTnElement,
  calculatePreviewSize,
  downloadAsTxt,
  fillElementWithRandomText,
  getFileExtFromString,
} from "../common/typescript/Helpers";

import Dropzone from "dropzone";
import EncryptedFile from "../common/typescript/EncryptedFile";
import EncryptedMessage from "../common/typescript/EncryptedMessage";
import { MDCRipple } from "@material/ripple";
import { MDCSnackbar } from "@material/snackbar";
import PrivateKey from "../common/typescript/PrivateKey";
import autosize from "autosize";
import availabelIcons from "../common/modules/FileDrop/available-icons.json";
import copy from "copy-to-clipboard";
import delay from "delay";
import isCryptoUseable from "../common/typescript/CryptoCheck";

main();

function main() {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  // --------- begin init key ---------
  let decryptType: "text" | "file" = "text";
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

  const messageTextareaContainer = $("#textarea-container") as HTMLTextAreaElement;
  const messageTextarea = $("#textarea-container > textarea") as HTMLTextAreaElement;
  const orParagraph = $("#or-p") as HTMLTextAreaElement;
  const fileDropContainer = $("#file-drop-container") as HTMLTextAreaElement;
  const decryptButton = $("#decrypt-message-button") as HTMLButtonElement;
  const decryptedMessageContainer = $("#decrypted-message-container") as HTMLDivElement;
  const decryptedMessageTextarea = $("#decrypted-message-container > textarea") as HTMLTextAreaElement;
  const successSnackbar = MDCSnackbar.attachTo($("#copy-success-snackbar") as HTMLDivElement);
  const failedSnackbar = MDCSnackbar.attachTo($("#copy-failed-snackbar") as HTMLDivElement);

  // --------- begin textarea ---------

  autosize(messageTextarea);

  // --------- end textarea ---------

  // --------- begin dropzone ---------
  Dropzone.autoDiscover = false;

  const previewTemplate = $("#file-preview-template") as HTMLTemplateElement;
  const filePreviewContainer = $("#file-preview-container") as HTMLTemplateElement;
  const filePreviewContainerWidth = filePreviewContainer.offsetWidth;
  const previewSize = calculatePreviewSize(filePreviewContainerWidth) + "px";

  const dropzone = new Dropzone("#dropzone", {
    autoProcessQueue: false,
    dictDefaultMessage: "Drop encrypted files here or click here to select encrypted files to decrypt",
    previewsContainer: "#file-preview-container",
    previewTemplate: previewTemplate.innerHTML,
    thumbnailMethod: "contain",
    thumbnailWidth: 90,
    thumbnailHeight: 90,
    fallback: () => {
      orParagraph.remove();
      fileDropContainer.remove();
    },
  });

  dropzone.on("addedfile", function(file) {
    onFileChange();

    const preview = file.previewElement.querySelector(".dz-preview") as HTMLDivElement;

    preview.style.width = previewSize;
    preview.style.height = previewSize;

    const fileNameSpan = file.previewElement.querySelector(".dz-filename > span") as HTMLSpanElement;
    const previewImage = file.previewElement.querySelector("img") as HTMLImageElement;
    const removeButton = file.previewElement.querySelector("button") as HTMLButtonElement;

    fileNameSpan.setAttribute("title", fileNameSpan.innerHTML);

    let fileExt = file.name ? getFileExtFromString(file.name) : "blank";
    const iconSpan = document.createElement("span");

    if (!availabelIcons.includes(fileExt)) fileExt = "blank";

    iconSpan.className = `file-icon fiv-viv fiv-icon-${fileExt} fiv-size-lg`;
    previewImage.parentNode?.insertBefore(iconSpan, previewImage);

    removeButton.addEventListener("click", () => {
      dropzone.removeFile(file);
    });
  });

  dropzone.on("removedfile", function(file) {
    onFileChange();
  });

  dropzone.on("thumbnail", function(file, dataUrl) {
    if (typeof dataUrl === "string") {
      const fileIcon = file.previewElement.querySelector(".file-icon") as HTMLSpanElement;

      fileIcon.remove();
    } else {
      const previewImage = file.previewElement.querySelector("img") as HTMLImageElement;

      previewImage.src = "";
      previewImage.alt = "";
    }
  });

  async function onFileChange() {
    decryptType = dropzone.files.length > 0 ? "file" : "text";
    toggleElement(messageTextareaContainer, dropzone.files.length > 0);
    toggleElement(orParagraph, dropzone.files.length > 0);
    hideElement(decryptedMessageContainer);
  }

  // hide dropzone when text is in the text box
  messageTextarea.addEventListener("input", onInput);
  async function onInput() {
    decryptType = messageTextarea.value.length > 0 ? "text" : "file";
    toggleElement(fileDropContainer, messageTextarea.value.length > 0);
    toggleElement(orParagraph, messageTextarea.value.length > 0);
    hideElement(decryptedMessageContainer);
  }

  async function toggleElement(element: HTMLElement, hide: boolean) {
    if (hide) hideElement(element);
    else showElement(element);
  }

  async function hideElement(element: HTMLElement) {
    element.classList.add("hide");
    await delay(250);
    if (element.classList.contains("hide")) element.classList.add("gone");
  }

  async function showElement(element: HTMLElement) {
    element.classList.remove("gone");
    await delay(1);
    element.classList.remove("hide");
  }

  // --------- end dropzone ---------

  // --------- begin encrypt button ---------

  autosize(decryptedMessageTextarea);
  decryptButton.addEventListener("click", () => {
    if (decryptType === "text") decryptMessage();
    else decryptFiles();
  });

  async function decryptFiles() {
    if (dropzone.files.length <= 0) return;

    const decryptPromises = dropzone.files.map(file => {
      const startTime = Date.now();
      const encryptedFile = new EncryptedFile(file, privateKey);

      return encryptedFile
        .decrypt()
        .then(() => {
          if (Date.now() - startTime < 5000) return delay(3000);
          else return Promise.resolve();
        })
        .then(() => encryptedFile.download());
    });

    decryptedMessageTextarea.value = "";
    autosize.update(decryptedMessageTextarea);

    hideElement(decryptedMessageContainer);
    decryptingText.classList.remove("gone");
    loadingOverlay.classList.remove("hide");
    loadingOverlay.classList.remove("gone");

    try {
      await Promise.all(decryptPromises);

      dropzone.removeAllFiles();
    } catch (e) {
      alert("Error possibly because one of the files was not encrypted with the corresponding encryption link");
      console.error(e);
    }

    await delay(1000);
    loadingOverlay.classList.add("hide");
    await delay(300);
    loadingOverlay.classList.add("gone");
  }

  async function decryptMessage() {
    if (messageTextarea.value.length <= 0) return;

    const encryptedMessage = new EncryptedMessage(messageTextarea.value, privateKey);

    decryptedMessageTextarea.value = "";
    autosize.update(decryptedMessageTextarea);
    showElement(decryptedMessageContainer);
    decryptingText.classList.remove("gone");
    loadingOverlay.classList.remove("hide");
    loadingOverlay.classList.remove("gone");

    try {
      const stopAnimation = showAnimatingText();
      const decryptedMessage = await encryptedMessage.decrypt();
      stopAnimation();
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

  function showAnimatingText() {
    const privateKeyStringLength = 64;
    const base64Length = Math.max(3 * ((messageTextarea.value.length - privateKeyStringLength) / 4) - 44, 10);
    const totalLength = Math.ceil(base64Length);

    return fillElementWithRandomText(decryptedMessageTextarea, "value", totalLength, () => {
      autosize.update(decryptedMessageTextarea);
    });
  }

  async function showDecryptedMessage(decryptedMessage: string) {
    animateAddTextTnElement(
      decryptedMessageTextarea,
      decryptedMessage,
      1500,
      "value",
      false,
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
