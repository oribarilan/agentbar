import { useEffect } from "react";
import { hideWindow, openSettings } from "../lib/commands";
import { suppressNextBlurHide } from "../lib/focus";
import { isMac } from "../lib/platform";

interface KeybindingActions {
  onToggleMode: () => void;
  onFocusSearchBar: () => void;
}

const VIM_ARROW_MAP: Record<string, string> = {
  h: "ArrowLeft",
  j: "ArrowDown",
  k: "ArrowUp",
  l: "ArrowRight",
};

function redispatchAsArrow(original: KeyboardEvent, arrowKey: string): void {
  const synthetic = new KeyboardEvent("keydown", {
    key: arrowKey,
    code: arrowKey,
    bubbles: true,
    cancelable: true,
  });
  original.target?.dispatchEvent(synthetic);
}

function isCmdOrCtrl(e: KeyboardEvent): boolean {
  return isMac() ? e.metaKey : e.ctrlKey;
}

export function useKeybindings(actions: KeybindingActions): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const arrow = VIM_ARROW_MAP[e.key.toLowerCase()];
        if (arrow) {
          e.preventDefault();
          redispatchAsArrow(e, arrow);
          return;
        }
      }

      if (isCmdOrCtrl(e) && e.key === ",") {
        e.preventDefault();
        suppressNextBlurHide();
        void openSettings();
        return;
      }

      if (e.key === "Tab" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        actions.onToggleMode();
        actions.onFocusSearchBar();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        void hideWindow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [actions]);
}
