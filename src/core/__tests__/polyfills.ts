import { JSDOM } from "jsdom";
import WebCrypto from "node-webcrypto-ossl";

// @ts-ignore
window = new JSDOM(``, {
  runScripts: "dangerously",
}).window;
// @ts-ignore
window.crypto = new WebCrypto();
