import { create } from "zustand";

interface Window {
  id: string;
}

interface WindowStore {
  windows: Window[];
  maxWindows: number;
  baseZIndex: number;
  addWindow: (id: string) => void;
  removeWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  getWindowZIndex: (id: string) => number;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  maxWindows: 10, // base + maxWindows = max z-index
  baseZIndex: 30, // current base z-index

  addWindow: (id: string) =>
    set((state) => {
      const newWindows = [...state.windows, { id }];
      if (newWindows.length > state.maxWindows) {
        newWindows.shift(); // Remove oldest window
      }
      return { windows: newWindows };
    }),

  removeWindow: (id: string) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  bringToFront: (id: string) =>
    set((state) => ({
      windows: [
        ...state.windows.filter((w) => w.id !== id),
        { ...state.windows.find((w) => w.id === id)! },
      ],
    })),

  getWindowZIndex: (id: string) => {
    const state = get();
    const index = state.windows.findIndex((w) => w.id === id);
    return state.baseZIndex + index;
  },
}));
