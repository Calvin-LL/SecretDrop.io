import "../common/modules/Header/header";

import {
  animateAddTextTnElement,
  calculatePreviewSize,
  downloadAsTxt,
  fillElementWithRandomText,
  getFileExtFromString,
} from "../common/typescript/Helpers";

import Dropzone from "dropzone";
import LZUTF8 from "lzutf8";
import { MDCRipple } from "@material/ripple";
import { MDCSnackbar } from "@material/snackbar";
import PlainFile from "../common/typescript/PlainFile";
import PlainMessage from "../common/typescript/PlainMessage";
import PublicKey from "../common/typescript/PublicKey";
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
  let encryptType: "text" | "file" = "text";
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

  const messageTextareaContainer = $("#textarea-container") as HTMLTextAreaElement;
  const messageTextarea = $("#textarea-container > textarea") as HTMLTextAreaElement;
  const orParagraph = $("#or-p") as HTMLTextAreaElement;
  const fileDropContainer = $("#file-drop-container") as HTMLTextAreaElement;
  const encryptButton = $("#encrypt-message-button") as HTMLButtonElement;
  const encryptedMessageContainer = $("#encrypted-message-container") as HTMLDivElement;
  const encryptedMessageTextarea = $("#encrypted-message-container > textarea") as HTMLTextAreaElement;
  const successSnackbar = MDCSnackbar.attachTo($("#copy-success-snackbar") as HTMLDivElement);
  const failedSnackbar = MDCSnackbar.attachTo($("#copy-failed-snackbar") as HTMLDivElement);

  autosize(messageTextarea);
  autosize(encryptedMessageTextarea);

  // --------- begin dropzone ---------
  Dropzone.autoDiscover = false;

  const previewTemplate = $("#file-preview-template") as HTMLTemplateElement;
  const filePreviewContainer = $("#file-preview-container") as HTMLTemplateElement;
  const filePreviewContainerWidth = filePreviewContainer.offsetWidth;
  const previewSize = calculatePreviewSize(filePreviewContainerWidth) + "px";

  const dropzone = new Dropzone("#dropzone", {
    autoProcessQueue: false,
    dictDefaultMessage: "Drop files here or click here to select files to encrypt",
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
    encryptType = dropzone.files.length > 0 ? "file" : "text";
    toggleElement(messageTextareaContainer, dropzone.files.length > 0);
    toggleElement(orParagraph, dropzone.files.length > 0);
    hideElement(encryptedMessageContainer);
  }

  // hide dropzone when text is in the text box
  messageTextarea.addEventListener("input", onInput);
  async function onInput() {
    encryptType = messageTextarea.value.length > 0 ? "text" : "file";
    toggleElement(fileDropContainer, messageTextarea.value.length > 0);
    toggleElement(orParagraph, messageTextarea.value.length > 0);
    hideElement(encryptedMessageContainer);
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
  encryptButton.addEventListener("click", () => {
    if (encryptType === "text") encryptMessage();
    else encryptFiles();
  });

  async function encryptFiles() {
    if (dropzone.files.length <= 0) return;

    const encryptPromises = dropzone.files.map(file => {
      const startTime = Date.now();
      const plainFile = new PlainFile(file, publicKey);

      return plainFile
        .encrypt()
        .then(() => {
          if (Date.now() - startTime < 5000) return delay(3000);
          else return Promise.resolve();
        })
        .then(() => plainFile.download());
    });

    encryptedMessageTextarea.value = "";
    autosize.update(encryptedMessageTextarea);

    hideElement(encryptedMessageContainer);
    encryptingText.classList.remove("gone");
    loadingOverlay.classList.remove("hide");
    loadingOverlay.classList.remove("gone");

    try {
      await Promise.all(encryptPromises);

      dropzone.removeAllFiles();
    } catch (e) {
      alert("Error");
      console.error(e);
    }

    await delay(1000);
    loadingOverlay.classList.add("hide");
    await delay(300);
    loadingOverlay.classList.add("gone");
  }

  async function encryptMessage() {
    if (messageTextarea.value.length <= 0) return;

    const plainMessage = new PlainMessage(messageTextarea.value, publicKey);

    encryptedMessageTextarea.value = "";
    autosize.update(encryptedMessageTextarea);

    showElement(encryptedMessageContainer);
    encryptingText.classList.remove("gone");
    loadingOverlay.classList.remove("hide");
    loadingOverlay.classList.remove("gone");

    try {
      const stopAnimation = showAnimatingText();
      const encryptedMessage = await plainMessage.encrypt();
      stopAnimation();
      showEncryptedMessage(encryptedMessage);
    } catch (e) {
      alert("Error");
      console.error(e);
    }
  }

  function showAnimatingText() {
    const privateKeyStringLength = 64;
    const base64Length = Math.max(4 * (messageTextarea.value.length + 44 / 3), 10);
    const totalLength = Math.ceil(privateKeyStringLength + base64Length + 1);

    return fillElementWithRandomText(encryptedMessageTextarea, "value", totalLength, () => {
      autosize.update(encryptedMessageTextarea);
    });
  }

  async function showEncryptedMessage(encryptedMessage: string) {
    animateAddTextTnElement(
      encryptedMessageTextarea,
      encryptedMessage,
      1500,
      "value",
      false,
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
