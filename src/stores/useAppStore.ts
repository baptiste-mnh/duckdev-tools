import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppState,
  UserPreferences,
  PWAState,
  HistoryEntry,
} from "../types";

const defaultPreferences: UserPreferences = {
  theme: "dark",
  jwtSecret: "your-256-bit-secret",
  passwordLength: 16,
  passwordOptions: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  },
  encodingDefaults: {
    defaultType: "base64",
  },
  colorPaletteDefaults: {
    defaultType: "monochromatic",
  },
  regexDefaults: {
    globalFlag: false,
    caseInsensitiveFlag: false,
    multilineFlag: false,
  },
};

const defaultPWAState: PWAState = {
  deferredPrompt: null,
  showInstallPrompt: false,
  isInstalled: false,
  isStandalone: false,
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentTool: null,
      setCurrentTool: (toolId) => set({ currentTool: toolId }),

      pwa: defaultPWAState,
      setPWAState: (updates) =>
        set((state) => ({
          pwa: { ...state.pwa, ...updates },
        })),

      preferences: defaultPreferences,
      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
      resetPreferences: () => set({ preferences: defaultPreferences }),

      history: [],
      addToHistory: (toolId, action, data, result) => {
        const entry: HistoryEntry = {
          id: generateId(),
          toolId,
          action,
          timestamp: Date.now(),
          data,
          result,
        };

        set((state) => ({
          history: [entry, ...state.history].slice(0, 100),
        }));
      },
      clearHistory: () => set({ history: [] }),
      getToolHistory: (toolId) => {
        const { history } = get();
        return history.filter((entry) => entry.toolId === toolId);
      },

      favorites: [],
      toggleFavorite: (toolId) =>
        set((state) => ({
          favorites: state.favorites.includes(toolId)
            ? state.favorites.filter((id) => id !== toolId)
            : [...state.favorites, toolId],
        })),
      getFavoriteTools: () => get().favorites,

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      toolUsageStats: {},
      incrementToolUsage: (toolId) =>
        set((state) => ({
          toolUsageStats: {
            ...state.toolUsageStats,
            [toolId]: (state.toolUsageStats[toolId] || 0) + 1,
          },
        })),
      getMostUsedTools: () => {
        const { toolUsageStats } = get();
        return Object.entries(toolUsageStats)
          .map(([toolId, count]) => ({ toolId, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);
      },
    }),
    {
      name: "duckdev-tools-storage",
      partialize: (state) => ({
        preferences: state.preferences,
        history: state.history,
        favorites: state.favorites,
        toolUsageStats: state.toolUsageStats,
      }),
    }
  )
);
