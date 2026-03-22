import { useEffect, useMemo } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import SearchBar from "./components/SearchBar";
import HintBar from "./components/HintBar";
import { hideWindow } from "./lib/commands";
import { focusSearchBar, shouldHideOnBlur } from "./lib/focus";
import { useKeybindings } from "./hooks/useKeybindings";
import { useSearchStore } from "./stores/searchStore";
import styles from "./App.module.css";

export default function App() {
  const mode = useSearchStore((s) => s.mode);
  const setQuery = useSearchStore((s) => s.setQuery);

  const keybindingActions = useMemo(
    () => ({
      onToggleMode: () => {
        useSearchStore.getState().toggleMode();
      },
      onFocusSearchBar: focusSearchBar,
    }),
    [],
  );

  useKeybindings(keybindingActions);

  useEffect(() => {
    let unlistenFocus: (() => void) | undefined;

    const setup = async () => {
      const appWindow = getCurrentWebviewWindow();
      const unlisten = await appWindow.onFocusChanged(({ payload: focused }) => {
        if (!focused) {
          if (shouldHideOnBlur()) {
            void hideWindow();
          }
          useSearchStore.getState().clearSearch();
        } else {
          focusSearchBar();
        }
      });
      unlistenFocus = unlisten;
    };

    void setup();
    return () => {
      unlistenFocus?.();
    };
  }, []);

  return (
    <div className={styles.launcher}>
      <SearchBar
        mode={mode}
        onQueryChange={setQuery}
        onArrowDown={() => {}}
        onArrowUp={() => {}}
      />
      <div className={styles.emptyState}>No features connected yet</div>
      <HintBar mode={mode} />
    </div>
  );
}
