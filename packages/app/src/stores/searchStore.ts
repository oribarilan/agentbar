import { create } from "zustand";

export type AppMode = "search" | "agent";

interface SearchState {
  mode: AppMode;
  query: string;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
  setQuery: (query: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  mode: "search",
  query: "",

  toggleMode: () => {
    set({ mode: get().mode === "search" ? "agent" : "search" });
  },

  setMode: (mode) => {
    set({ mode });
  },

  setQuery: (query) => {
    set({ query });
  },

  clearSearch: () => {
    set({
      mode: "search",
      query: "",
    });
  },
}));
