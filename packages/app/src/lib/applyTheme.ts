export function applyFontSize(size: string) {
  document.documentElement.dataset.fontSize = size;
}

function resolveTheme(theme: string): string {
  if (theme === "system" && typeof window !== "undefined" && typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "agentbar" : "agentbar-light";
  }
  if (theme === "system") {
    return "agentbar";
  }
  return theme;
}

export function applyTheme(theme: string) {
  document.documentElement.dataset.theme = resolveTheme(theme);
  document.documentElement.dataset.themePreference = theme;
}

if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (document.documentElement.dataset.themePreference === "system") {
      applyTheme("system");
    }
  });
}
