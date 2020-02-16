import "@material/mwc-button";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

switch (window.location.pathname.replace(/\//g, "")) {
  case "":
    setToUnelevated("#generate-page-button");
    break;
  case "encrypt":
    setToUnelevated("#encrypt-page-button");
    break;
  case "decrypt":
    setToUnelevated("#decrypt-page-button");
    break;
  case "help":
    setToUnelevated("#help-page-button");
    break;
}

function setToUnelevated(selector: string) {
  $(selector)?.setAttribute("unelevated", "");
}
