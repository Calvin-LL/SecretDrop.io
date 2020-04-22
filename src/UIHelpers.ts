export function scrollTo(selector: string) {
  (document.querySelector(selector) as HTMLDivElement).scrollIntoView({
    behavior: "smooth",
  });
}
