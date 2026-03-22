export function focusSearchBar(): void {
  const input = document.querySelector<HTMLInputElement>("input[aria-label='Search']");
  input?.focus();
}

let blurHideSuppressedUntil = 0;

export function suppressNextBlurHide(): void {
  blurHideSuppressedUntil = Date.now() + 500;
}

export function shouldHideOnBlur(): boolean {
  return Date.now() > blurHideSuppressedUntil;
}
