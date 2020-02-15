import "@material/mwc-checkbox";
import "@material/mwc-formfield";
import "@material/mwc-icon-button";

import KeyPair from "./common/typescript/KeyPair";
import { saveAs } from "file-saver";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const encryptLink = "secretdrop.io/encrypt?key=";
const decryptLink = "secretdrop.io/decrypt?key=";

generateKeys();

$("#button-download-public-key")?.addEventListener("click", () => {
  const url = ($("#public-url") as HTMLLinkElement)?.href;
  downloadAsTxt(url, "public-key.txt");
});

$("#button-download-private-key")?.addEventListener("click", () => {
  const url = ($("#private-url") as HTMLLinkElement)?.href;
  downloadAsTxt(url, "private-key.txt");
});

$$(".checkbox-expert-mode").forEach(el => {
  el.addEventListener("change", onExpertModeCheck.bind(el));
});

function onExpertModeCheck() {
  $$(".checkbox-expert-mode").forEach(el => {
    // @ts-ignore
    el.checked = this.checked;
  });
}

async function generateKeys() {
  const keyPair = new KeyPair();
  await keyPair.init();
  const publicKey = await keyPair.getPublicKey();
  const privatekey = await keyPair.getPrivateKey();
  const publicKeyString = await publicKey.getKeyString();
  const privatekeyString = await privatekey.getKeyString();

  const publicKeyEl = $("#public-url");
  const privateKeyEl = $("#private-url");

  if (publicKeyEl) {
    // @ts-ignore
    publicKeyEl.href = encryptLink + publicKeyString;
    publicKeyEl.innerHTML += encryptLink;
    animateAddTextTnElement(publicKeyEl, publicKeyString);
  }

  if (privateKeyEl) {
    // @ts-ignore
    privateKeyEl.href = decryptLink + privatekeyString;
    privateKeyEl.innerHTML += decryptLink;
    animateAddTextTnElement(privateKeyEl, privatekeyString);
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
