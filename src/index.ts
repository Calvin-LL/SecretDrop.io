import "./common/modules/Header/header";

import { animateAddTextTnElement, downloadAsTxt } from "./common/typescript/Helpers";

import KeyPair from "./common/typescript/KeyPair";
import { MDCRipple } from "@material/ripple";
import { MDCSnackbar } from "@material/snackbar";
import copy from "copy-to-clipboard";
import delay from "delay";

main();

function main() {
  if (window.crypto?.subtle === undefined)
    return alert("This browser does not support Web Crypto API. This website will not work.");

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
  const successSnackbar = MDCSnackbar.attachTo($("#copy-success-snackbar") as HTMLDivElement);
  const failedSnackbar = MDCSnackbar.attachTo($("#copy-failed-snackbar") as HTMLDivElement);

  const loadingOverlay = $("#overlay-loading-generating-key") as HTMLDivElement;

  $$(".mdc-button").forEach(element => MDCRipple.attachTo(element));
  $$(".mdc-icon-button").forEach(element => (MDCRipple.attachTo(element).unbounded = true));
  // --------- end init material web components ---------

  // --------- begin download buttons ---------
  $("#public-key-url-area .download-button")?.addEventListener("click", () => {
    const url = ($("#public-url") as HTMLLinkElement)?.href;
    downloadAsTxt(url, "encryption-link.txt");
  });

  $("#private-key-url-area .download-button")?.addEventListener("click", () => {
    const url = ($("#private-url") as HTMLLinkElement)?.href;
    downloadAsTxt(url, "decryption-link.txt");
  });
  // --------- end download buttons ---------

  // --------- begin copy buttons ---------
  $("#public-key-url-area .copy-button")?.addEventListener("click", onCopyClick.bind(null, "#public-url"));
  $("#private-key-url-area .copy-button")?.addEventListener("click", onCopyClick.bind(null, "#private-url"));

  function onCopyClick(selector: string) {
    const url = ($(selector) as HTMLLinkElement)?.href;

    if (copy(url)) successSnackbar.open();
    else failedSnackbar.open();
  }
  // --------- end copy buttons ---------

  async function generateKeys() {
    const publicKeyEl = $("#public-url") as HTMLLinkElement;
    const privateKeyEl = $("#private-url") as HTMLLinkElement;

    publicKeyEl.innerHTML += encryptLink;
    privateKeyEl.innerHTML += decryptLink;

    const keyPair = new KeyPair();
    const publicKeyString = await keyPair.getPublicKeyString();
    const privatekeyString = await keyPair.getPrivateKeyString();

    let publicKeyShown = false;
    let privateKeyShown = false;

    publicKeyEl.href = encryptLink + publicKeyString;
    privateKeyEl.href = decryptLink + privatekeyString;

    await delay(1000); // pause for dramatic effects

    animateAddTextTnElement(publicKeyEl, publicKeyString, 3000, undefined, undefined, () => {
      publicKeyShown = true;
      bothKeyShown();
    });

    animateAddTextTnElement(privateKeyEl, privatekeyString, 3000, undefined, undefined, () => {
      privateKeyShown = true;
      bothKeyShown();
    });

    async function bothKeyShown() {
      if (publicKeyShown && privateKeyShown) {
        await delay(500);
        loadingOverlay.classList.add("hide");
        await delay(300);
        loadingOverlay.classList.add("gone");
      }
    }
  }
}
