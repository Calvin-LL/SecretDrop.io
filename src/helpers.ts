export function scrollTo(selector: string): void {
  scrollToElement(document.querySelector(selector) as Element);
}

export function scrollToElement(element: Element | undefined): void {
  element?.scrollIntoView({
    behavior: "smooth",
  });
}
