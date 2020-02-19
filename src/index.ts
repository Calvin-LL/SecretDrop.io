import "./common/modules/Header/header";

import { animateAddTextTnElement, downloadAsTxt } from "./common/typescript/Helpers";

import KeyPair from "./common/typescript/KeyPair";
import { KeyPairConfig } from "./common/typescript/KeyPair";
import { MDCCheckbox } from "@material/checkbox";
import { MDCFormField } from "@material/form-field";
import { MDCRipple } from "@material/ripple";
import { MDCSelect } from "@material/select";
import { MDCSnackbar } from "@material/snackbar";
import { MDCTextField } from "@material/textfield";
import copy from "copy-to-clipboard";

if (window.crypto?.subtle === undefined)
  alert("This browser does not support Web Crypto API. This website will not work.");

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let encryptLink = "https://secretdrop.io/encrypt?key=";
let decryptLink = "https://secretdrop.io/decrypt?key=";

if (process.env.NODE_ENV !== "production") {
  encryptLink = `http://${window.location.host}/encrypt?key=`;
  decryptLink = `http://${window.location.host}/decrypt?key=`;
}

generateKeys();

// --------- begin init material web components ---------
const modulusLengthInputs: MDCTextField[] = [];
const hashAlgorithmSelect: MDCSelect[] = [];

const successSnackbar = MDCSnackbar.attachTo($("#copy-success-snackbar") as HTMLDivElement);
const failedSnackbar = MDCSnackbar.attachTo($("#copy-failed-snackbar") as HTMLDivElement);

$$(".mdc-button").forEach(element => MDCRipple.attachTo(element));
$$(".mdc-icon-button").forEach(element => (MDCRipple.attachTo(element).unbounded = true));

$$(".mdc-checkbox").forEach(element => {
  if (element.parentElement) MDCFormField.attachTo(element.parentElement).input = MDCCheckbox.attachTo(element);
});

$$(".mdc-text-field.input-modulus-length").forEach(element => modulusLengthInputs.push(MDCTextField.attachTo(element)));
$$(".mdc-select.select-hash-algorithm").forEach(element => hashAlgorithmSelect.push(MDCSelect.attachTo(element)));
// --------- end init material web components ---------

// --------- begin download buttons ---------
$("#button-download-public-key")?.addEventListener("click", () => {
  const url = ($("#public-url") as HTMLLinkElement)?.href;
  downloadAsTxt(url, "public-link.txt");
});

$("#button-download-private-key")?.addEventListener("click", () => {
  const url = ($("#private-url") as HTMLLinkElement)?.href;
  downloadAsTxt(url, "private-link.txt");
});
// --------- end download buttons ---------

// --------- begin copy buttons ---------
$("#button-copy-public-key")?.addEventListener("click", onCopyClick.bind(null, "#public-url"));
$("#button-copy-private-key")?.addEventListener("click", onCopyClick.bind(null, "#private-url"));

function onCopyClick(selector: string) {
  const url = ($(selector) as HTMLLinkElement)?.href;

  if (copy(url)) successSnackbar.open();
  else failedSnackbar.open();
}
// --------- end copy buttons ---------

// --------- begin expert checkboxes ---------
$$(".checkbox-expert-mode input").forEach(el => {
  el.addEventListener("change", onExpertModeCheck.bind(null, el as HTMLInputElement));
});

function onExpertModeCheck(element: HTMLInputElement) {
  const checked = element.checked;

  $$(".bottom-bar-expert").forEach(el => el.classList.toggle("hidden", !checked));
  $$(".url-container").forEach(el => el.classList.toggle("expert", checked));

  $$(".checkbox-expert-mode input").forEach(el => {
    (el as HTMLInputElement).checked = element.checked;
    if (element.checked) {
      modulusLengthInputs.forEach(el => el.layout());
      hashAlgorithmSelect.forEach(el => el.layout());
    }
  });

  // change titles
  const publicKeyTitle = $("#public-key-url-area .title");
  const privateKeyTitle = $("#private-key-url-area .title");

  if (publicKeyTitle) publicKeyTitle.innerHTML = checked ? "Public Key Link" : "Encryption Link";
  if (privateKeyTitle) privateKeyTitle.innerHTML = checked ? "Private Key Link" : "Decryption Link";
}
// --------- end expert checkboxes ---------

// --------- begin expert modulus length input ---------
$$(".mdc-text-field.input-modulus-length input").forEach(el => {
  el.addEventListener("keyup", onModulusLengthChange.bind(null, el as HTMLInputElement));
  el.addEventListener("change", onModulusLengthChange.bind(null, el as HTMLInputElement));
});

function onModulusLengthChange(element: HTMLInputElement) {
  modulusLengthInputs.forEach(el => {
    el.value = element.value;
  });
}
// --------- end expert modulus length input ---------

// --------- begin expert modulus length input ---------
hashAlgorithmSelect.forEach(el => {
  el.listen("MDCSelect:change", onHashAlgorithmChange.bind(null, el));
});

function onHashAlgorithmChange(element: MDCSelect) {
  hashAlgorithmSelect.forEach(el => {
    if (el !== element && el.selectedIndex !== element.selectedIndex) el.selectedIndex = element.selectedIndex;
  });
}
// --------- end expert modulus length input ---------

// --------- begin generate new key buttons ---------
const loadingOverlay = $("#overlay-loading-generating-key") as HTMLDivElement;

$$(".button-generate-new-key").forEach(el => {
  el.addEventListener("click", onGenerateNewKeyCheck.bind(el));
});

function onGenerateNewKeyCheck() {
  const modulusLength = parseInt(modulusLengthInputs[0].value);
  const hashAlgorithm = hashAlgorithmSelect[0].value;

  if (modulusLength >= 256 && modulusLength <= 16384 && modulusLength % 8 === 0 && hashAlgorithm) {
    generateKeys({ modulusLength, hash: hashAlgorithm });

    loadingOverlay.classList.remove("hide");
    loadingOverlay.classList.remove("gone");
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

  let publicKeyShown = false;
  let privateKeyShown = false;

  if (publicKeyEl) {
    publicKeyEl.href = encryptLink + publicKeyString;
    publicKeyEl.innerHTML = "";
    publicKeyEl.innerHTML += encryptLink;
    if (config) publicKeyEl.innerHTML += publicKeyString;
    else
      animateAddTextTnElement(publicKeyEl, publicKeyString, undefined, undefined, undefined, () => {
        publicKeyShown = true;
        bothKeyShown();
      });
  }

  if (privateKeyEl) {
    privateKeyEl.href = decryptLink + privatekeyString;
    privateKeyEl.innerHTML = "";
    privateKeyEl.innerHTML += decryptLink;
    if (config) privateKeyEl.innerHTML += privatekeyString;
    else
      animateAddTextTnElement(privateKeyEl, privatekeyString, undefined, undefined, undefined, () => {
        privateKeyShown = true;
        bothKeyShown();
      });
  }

  if (config) bothKeyShown(true);

  function bothKeyShown(force: boolean = false) {
    if ((publicKeyShown && privateKeyShown) || force)
      setTimeout(() => {
        loadingOverlay.classList.add("hide");
        setTimeout(() => {
          loadingOverlay.classList.add("gone");
        }, 300);
      }, 500);
  }
}
