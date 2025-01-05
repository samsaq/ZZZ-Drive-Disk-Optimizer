import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DiskScan, processScanData } from "@/lib/utils";

interface ScanStore {
  diskScans: DiskScan[];
  lastUploadTime: string | null;
  setScans: (jsonData: any[]) => void;
  syncWithServer: (serverData: {
    diskScans: DiskScan[];
    lastUploadTime: string;
  }) => void;
  clear: () => void;
}

export const useScanStore = create<ScanStore>()(
  persist(
    (set) => ({
      diskScans: [],
      lastUploadTime: null,
      setScans: (jsonData) => {
        const processed = processScanData(jsonData);
        set({
          diskScans: processed.disk_scans,
          lastUploadTime: new Date().toISOString(),
        });
      },
      syncWithServer: (serverData) => {
        // Only update if server data is newer
        if (!serverData.lastUploadTime) return;
        set((state) => {
          if (
            !state.lastUploadTime ||
            new Date(serverData.lastUploadTime) > new Date(state.lastUploadTime)
          ) {
            return {
              diskScans: serverData.diskScans,
              lastUploadTime: serverData.lastUploadTime,
            };
          }
          return state;
        });
      },
      clear: () => set({ diskScans: [], lastUploadTime: null }),
    }),
    {
      name: "disk-scan-storage",
      version: 1, // Version number for future schema migrations
    },
  ),
);
