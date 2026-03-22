import { useEffect, useRef, type KeyboardEvent } from "react";
import Kbd from "./Kbd";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  mode: "search" | "agent";
  onQueryChange: (query: string) => void;
  onArrowDown: () => void;
  onArrowUp?: () => void;
}

export default function SearchBar({
  mode,
  onQueryChange,
  onArrowDown,
  onArrowUp,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onArrowDown();
      return;
    }

    if (e.key === "ArrowUp" && onArrowUp) {
      e.preventDefault();
      onArrowUp();
    }
  };

  const placeholder = mode === "agent" ? "Agent mode (controls only)" : "Type to search...";

  return (
    <div className={mode === "agent" ? styles.wrapperAgent : styles.wrapper}>
      <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>

      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        aria-label="Search"
        onChange={(e) => {
          onQueryChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />

      <Kbd keys="Tab" />
    </div>
  );
}
