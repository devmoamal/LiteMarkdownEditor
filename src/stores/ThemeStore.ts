import type { Theme } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStoreState = {
  theme: Theme;
  toggle: () => void;
};

const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      theme: "light",
      toggle: () =>
        set((state) => ({ theme: state.theme == "dark" ? "light" : "dark" })),
    }),
    {
      name: "theme",
    }
  )
);

export default useThemeStore;
