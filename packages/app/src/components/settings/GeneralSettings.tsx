import type { AgentbarConfig } from "../../lib/commands";
import { applyFontSize, applyTheme } from "../../lib/applyTheme";
import ResetSection from "./ResetSection";
import styles from "./settings.module.css";

interface GeneralSettingsProps {
  config: AgentbarConfig;
  onUpdate: (config: AgentbarConfig) => Promise<void>;
  onResetSection: (section: keyof AgentbarConfig) => Promise<AgentbarConfig | undefined>;
}

const FONT_SIZES = [
  { value: "extra-small", label: "XS" },
  { value: "small", label: "S" },
  { value: "medium", label: "M" },
  { value: "large", label: "L" },
] as const;

export default function GeneralSettings({
  config,
  onUpdate,
  onResetSection,
}: GeneralSettingsProps) {
  const handleThemeChange = (theme: string) => {
    applyTheme(theme);
    void onUpdate({
      ...config,
      appearance: { ...config.appearance, theme },
    });
  };

  const handleFontSizeChange = (size: string) => {
    applyFontSize(size);
    void onUpdate({
      ...config,
      appearance: { ...config.appearance, font_size: size },
    });
  };

  const handleLaunchToggle = () => {
    void onUpdate({
      ...config,
      general: { ...config.general, launch_at_login: !config.general.launch_at_login },
    });
  };

  const handleResetDefaults = async () => {
    await onResetSection("general");
    const updated = await onResetSection("appearance");
    if (updated) {
      applyFontSize(updated.appearance.font_size);
      applyTheme(updated.appearance.theme);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>General</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Behavior</h3>
        <div className={styles.row}>
          <div>
            <span className={styles.label}>Launch at login</span>
            <span className={styles.sublabel}>Start Agentbar when you log in</span>
          </div>
          <button
            className={config.general.launch_at_login ? styles.toggleOn : styles.toggle}
            onClick={handleLaunchToggle}
            aria-label="Toggle launch at login"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Appearance</h3>
        <div className={styles.row}>
          <span className={styles.label}>Theme</span>
          <div className={styles.segmentedControl}>
            <button
              className={config.appearance.theme === "system" ? styles.segmentedButtonActive : styles.segmentedButton}
              onClick={() => {
                handleThemeChange("system");
              }}
            >
              System
            </button>
            <button
              className={
                config.appearance.theme === "agentbar"
                  ? styles.segmentedButtonActive
                  : styles.segmentedButton
              }
              onClick={() => {
                handleThemeChange("agentbar");
              }}
            >
              Dark
            </button>
            <button
              className={
                config.appearance.theme === "agentbar-light"
                  ? styles.segmentedButtonActive
                  : styles.segmentedButton
              }
              onClick={() => {
                handleThemeChange("agentbar-light");
              }}
            >
              Light
            </button>
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Font size</span>
          <div className={styles.segmentedControl}>
            {FONT_SIZES.map((opt) => (
              <button
                key={opt.value}
                className={
                  config.appearance.font_size === opt.value
                    ? styles.segmentedButtonActive
                    : styles.segmentedButton
                }
                onClick={() => {
                  handleFontSizeChange(opt.value);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ResetSection label="Reset general settings to defaults?" onReset={handleResetDefaults} />
    </div>
  );
}
