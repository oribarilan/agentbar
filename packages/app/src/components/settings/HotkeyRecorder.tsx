import { useCallback, useRef, useState } from "react";
import styles from "./settings.module.css";

interface HotkeyRecorderProps {
  value: string;
  onChange: (hotkey: string) => void;
  ariaLabel: string;
}

function formatKeyCombo(e: React.KeyboardEvent): string | null {
  const key = e.key;
  if (["Control", "Shift", "Alt", "Meta"].includes(key)) {
    return null;
  }

  const parts: string[] = [];
  if (e.metaKey || e.ctrlKey) parts.push("CmdOrCtrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  if (parts.length === 0) return null;

  let normalizedKey = key;
  switch (key) {
    case " ":
      normalizedKey = "Space";
      break;
    case "ArrowUp":
      normalizedKey = "Up";
      break;
    case "ArrowDown":
      normalizedKey = "Down";
      break;
    case "ArrowLeft":
      normalizedKey = "Left";
      break;
    case "ArrowRight":
      normalizedKey = "Right";
      break;
    default:
      if (normalizedKey.length === 1) {
        normalizedKey = normalizedKey.toUpperCase();
      }
      break;
  }

  parts.push(normalizedKey);
  return parts.join("+");
}

function displayHotkey(hotkey: string): string {
  return hotkey
    .replace(/CmdOrCtrl\+/g, "⌘")
    .replace(/Shift\+/g, "⇧")
    .replace(/Alt\+/g, "⌥")
    .replace(/Ctrl\+/g, "⌃");
}

export default function HotkeyRecorder({ value, onChange, ariaLabel }: HotkeyRecorderProps) {
  const [recording, setRecording] = useState(false);
  const inputRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === "Escape") {
        setRecording(false);
        inputRef.current?.blur();
        return;
      }

      const combo = formatKeyCombo(e);
      if (combo) {
        onChange(combo);
        setRecording(false);
        inputRef.current?.blur();
      }
    },
    [onChange],
  );

  return (
    <span className={[styles.hotkeyCapsule, recording ? styles.hotkeyCapsuleRecording : ""].join(" ")}>
      {recording ? (
        <button
          ref={inputRef}
          className={styles.hotkeyBtn}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            if (e.relatedTarget && e.currentTarget.parentElement?.contains(e.relatedTarget)) {
              return;
            }
            setRecording(false);
          }}
          aria-label={ariaLabel}
          autoFocus
        >
          <span className={styles.hotkeyPlaceholder}>Press keys…</span>
        </button>
      ) : (
        <button
          className={styles.hotkeyBtn}
          onClick={() => {
            setRecording(true);
          }}
          aria-label={ariaLabel}
        >
          {value ? (
            <span className={styles.hotkeyValue}>{displayHotkey(value)}</span>
          ) : (
            <span className={styles.hotkeyPlaceholder}>none</span>
          )}
        </button>
      )}
    </span>
  );
}
