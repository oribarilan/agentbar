import { isMac } from "../lib/platform";
import styles from "./Kbd.module.css";

const MAC_MODIFIERS: Record<string, string> = {
  CmdOrCtrl: "⌘",
  Shift: "⇧",
  Alt: "⌥",
  Ctrl: "⌃",
};

const PC_MODIFIERS: Record<string, string> = {
  CmdOrCtrl: "Ctrl",
  Shift: "Shift",
  Alt: "Alt",
  Ctrl: "Ctrl",
};

const SYMBOL_MAP: Record<string, string> = {
  Enter: "↵",
  Escape: "⎋",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Tab: "Tab",
};

function formatKeys(keys: string, mac: boolean): string[] {
  const modifiers = mac ? MAC_MODIFIERS : PC_MODIFIERS;
  return keys.split("+").map((part) => {
    const trimmed = part.trim();
    return modifiers[trimmed] ?? SYMBOL_MAP[trimmed] ?? trimmed;
  });
}

interface KbdProps {
  keys: string;
}

export default function Kbd({ keys }: KbdProps) {
  const mac = isMac();
  const segments = formatKeys(keys, mac);
  return <kbd className={styles.kbd}>{segments.join(mac ? "" : "+")}</kbd>;
}
