import "@material/mwc-checkbox";
import "@material/mwc-formfield";
import "@material/mwc-icon-button";
import "@material/mwc-snackbar";
import "@material/mwc-textfield";
import "@material/mwc-select";
import "@material/mwc-button";
import "@material/mwc-list/mwc-list-item";

import { Checkbox } from "@material/mwc-checkbox";
import KeyPair from "./common/typescript/KeyPair";
import { KeyPairConfig } from "./common/typescript/KeyPair";
import { Select } from "@material/mwc-select";
import { Snackbar } from "@material/mwc-snackbar";
import { TextField } from "@material/mwc-textfield";
import copy from "copy-to-clipboard";
import { saveAs } from "file-saver";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let encryptLink = "https://secretdrop.io/encrypt?key=";
let decryptLink = "https://secretdrop.io/decrypt?key=";

if (process.env.NODE_ENV !== "production") {
  encryptLink = `http://${window.location.host}/encrypt?key=`;
  decryptLink = `http://${window.location.host}/decrypt?key=`;
}

generateKeys();

// --------- begin download buttons ---------
$("#button-download-public-key")?.addEventListener("click", () => {
  const url = ($("#public-url") as HTMLLinkElement)?.href;
  downloadAsTxt(url, "public-key.txt");
});

$("#button-download-private-key")?.addEventListener("click", () => {
  const url = ($("#private-url") as HTMLLinkElement)?.href;
  downloadAsTxt(url, "private-key.txt");
});
// --------- end download buttons ---------

// --------- begin copy buttons ---------
$("#button-copy-public-key")?.addEventListener("click", onCopyClick.bind(null, "#public-url"));

$("#button-copy-private-key")?.addEventListener("click", onCopyClick.bind(null, "#private-url"));

function onCopyClick(selector: string) {
  const url = ($(selector) as HTMLLinkElement)?.href;

  if (copy(url)) ($("#copy-success-snackbar") as Snackbar)?.open();
  else ($("#copy-failed-snackbar") as Snackbar)?.open();
}
// --------- end copy buttons ---------

// --------- begin expert checkboxes ---------
$$(".checkbox-expert-mode").forEach(el => {
  el.addEventListener("change", onExpertModeCheck.bind(null, el as Checkbox));
});

function onExpertModeCheck(element: Checkbox) {
  const checked = element.checked;

  $$(".bottom-bar-expert").forEach(el => el.classList.toggle("hidden", !checked));
  $$(".input-modulus-length, .select-hash-algorithm").forEach(el => {
    if (checked) (el as TextField).layout();
  });
  $$(".url-container").forEach(el => el.classList.toggle("expert", checked));

  $$(".checkbox-expert-mode").forEach(el => {
    (el as Checkbox).checked = element.checked;
  });
}
// --------- end expert checkboxes ---------

// --------- begin expert modulus length input ---------
$$(".input-modulus-length").forEach(el => {
  el.addEventListener("keyup", onModulusLengthChange.bind(null, el as TextField));
  el.addEventListener("change", onModulusLengthChange.bind(null, el as TextField));
});

function onModulusLengthChange(element: TextField) {
  $$(".input-modulus-length").forEach(el => {
    (el as TextField).value = element.value;
  });
}
// --------- end expert modulus length input ---------

// --------- begin expert modulus length input ---------
$$(".select-hash-algorithm").forEach(el => {
  el.addEventListener("selected", onHashAlgorithmChange.bind(null, el as Select));
});

function onHashAlgorithmChange(element: Select) {
  $$(".select-hash-algorithm").forEach(el => {
    (el as Select).select(element.index);
  });
}
// --------- end expert modulus length input ---------

// --------- begin generate new key buttons ---------
$$(".button-generate-new-key").forEach(el => {
  el.addEventListener("click", onGenerateNewKeyCheck.bind(el));
});

function onGenerateNewKeyCheck() {
  const modulusLength = parseInt(($(".input-modulus-length") as HTMLInputElement).value);
  const hashAlgorithm = ($(".select-hash-algorithm") as HTMLSelectElement).value;

  if (modulusLength >= 256 && modulusLength <= 16384 && modulusLength % 8 === 0 && hashAlgorithm) {
    generateKeys({ modulusLength, hash: hashAlgorithm });
  }
}
// --------- end generate new key buttons ---------

async function generateKeys(config?: KeyPairConfig) {
  const keyPair = new KeyPair(config);
  await keyPair.init();
  const publicKey = await keyPair.getPublicKey();
  const privatekey = await keyPair.getPrivateKey();
  const publicKeyString = await publicKey.getKeyString();
  const privatekeyString = await privatekey.getKeyString();

  const publicKeyEl = $("#public-url") as HTMLLinkElement | null;
  const privateKeyEl = $("#private-url") as HTMLLinkElement | null;

  if (publicKeyEl) {
    publicKeyEl.href = encryptLink + publicKeyString;
    publicKeyEl.innerHTML = "";
    publicKeyEl.innerHTML += encryptLink;
    if (config) publicKeyEl.innerHTML += publicKeyString;
    else animateAddTextTnElement(publicKeyEl, publicKeyString);
  }

  if (privateKeyEl) {
    privateKeyEl.href = decryptLink + privatekeyString;
    privateKeyEl.innerHTML = "";
    privateKeyEl.innerHTML += decryptLink;
    if (config) privateKeyEl.innerHTML += privatekeyString;
    else animateAddTextTnElement(privateKeyEl, privatekeyString);
  }

  setTimeout(() => {
    $("#overlay-loading-generating-key")?.classList.add("hide");
  }, 1500);
}

function animateAddTextTnElement(element: Element, s: string) {
  let length = 0;

  const intervalId = setInterval(() => {
    if (length <= s.length) {
      element.innerHTML += s.substring(length, length + 5);
      length += 5;
    } else {
      clearInterval(intervalId);
    }
  }, 1);
}

function downloadAsTxt(s: string, filename: string) {
  const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
}
