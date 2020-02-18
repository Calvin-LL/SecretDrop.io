const $ = document.querySelector.bind(document);

const logo: HTMLDivElement | null = $("#header .animated-logo-container");
const buttons: HTMLDivElement | null = $("#header .button-container");

window.addEventListener("resize", resizeHeader);
resizeHeader();

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
  $(selector)?.classList.add("mdc-button--raised");
}

function resizeHeader() {
  const logoBottom = (logo?.offsetTop ?? 0) + (logo?.offsetHeight ?? 0);
  const buttonTop = buttons?.offsetTop ?? 0;
  const isHeaderWrapped = logoBottom <= buttonTop;

  $("#header .content")?.classList.toggle("wrapped", isHeaderWrapped);
}
