import type { AgentbarConfig } from "../../lib/commands";
import HotkeyRecorder from "./HotkeyRecorder";
import styles from "./settings.module.css";

interface KeybindingsSettingsProps {
  config: AgentbarConfig;
  onUpdate: (config: AgentbarConfig) => Promise<void>;
}

export default function KeybindingsSettings({ config, onUpdate }: KeybindingsSettingsProps) {
  const handleHotkeyChange = (hotkey: string) => {
    if (!hotkey) return;

    void onUpdate({
      ...config,
      general: {
        ...config.general,
        hotkey,
      },
    });
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Keybindings</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Global</h3>
        <div className={styles.row}>
          <div>
            <span className={styles.label}>Launcher hotkey</span>
            <span className={styles.sublabel}>Used system-wide to toggle the floating bar</span>
          </div>
          <HotkeyRecorder
            value={config.general.hotkey}
            onChange={handleHotkeyChange}
            ariaLabel="Launcher hotkey"
          />
        </div>
      </section>
    </div>
  );
}
