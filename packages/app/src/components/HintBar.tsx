import Kbd from "./Kbd";
import styles from "./HintBar.module.css";

interface HintBarProps {
  mode: "search" | "agent";
}

interface Hint {
  label: string;
  keys: string;
  raw?: boolean;
}

const SEARCH_HINTS = [
  { label: "Navigate", keys: "↑↓", raw: true },
  { label: "Agent", keys: "Tab" },
  { label: "Dismiss", keys: "Escape" },
] as const satisfies ReadonlyArray<Hint>;

const AGENT_HINTS = [
  { label: "Search", keys: "Tab" },
  { label: "Settings", keys: "CmdOrCtrl+," },
  { label: "Dismiss", keys: "Escape" },
] as const satisfies ReadonlyArray<Hint>;

export default function HintBar({ mode }: HintBarProps) {
  const hints: Hint[] = mode === "search" ? [...SEARCH_HINTS] : [...AGENT_HINTS];

  return (
    <div className={styles.bar}>
      <div className={styles.hints}>
        {hints.map((hint) => (
          <span key={hint.label + hint.keys} className={styles.hint}>
            {hint.raw ? <kbd className={styles.rawKbd}>{hint.keys}</kbd> : <Kbd keys={hint.keys} />}
            <span className={styles.label}>{hint.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
