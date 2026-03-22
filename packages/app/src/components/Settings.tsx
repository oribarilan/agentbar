import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import GeneralSettings from "./settings/GeneralSettings";
import KeybindingsSettings from "./settings/KeybindingsSettings";
import { useConfig } from "../hooks/useConfig";
import styles from "./Settings.module.css";

type SettingsPage = "general" | "keybindings";

export default function Settings() {
  const [activePage, setActivePage] = useState<SettingsPage>("general");
  const { config, isLoading, update, resetSection } = useConfig();

  useEffect(() => {
    if (!isLoading && config) {
      void getCurrentWindow().show();
    }
  }, [isLoading, config]);

  if (isLoading || !config) {
    return <div className={styles.container}>Loading…</div>;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <h1 className={styles.title}>Settings</h1>

        <button
          className={activePage === "general" ? styles.navItemActive : styles.navItem}
          onClick={() => {
            setActivePage("general");
          }}
        >
          General
        </button>

        <button
          className={activePage === "keybindings" ? styles.navItemActive : styles.navItem}
          onClick={() => {
            setActivePage("keybindings");
          }}
        >
          Keybindings
        </button>
      </nav>

      <main className={styles.content}>
        {activePage === "general" && (
          <GeneralSettings config={config} onUpdate={update} onResetSection={resetSection} />
        )}
        {activePage === "keybindings" && <KeybindingsSettings config={config} onUpdate={update} />}
      </main>
    </div>
  );
}
