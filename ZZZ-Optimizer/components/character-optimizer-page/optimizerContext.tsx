import { createContext, useContext, ReactNode, useState, useMemo } from "react";
import { DiskScan } from "@/lib/utils";
import { DiskDriveSet } from "@/lib/diskStats";
import { WEngineStats } from "@/lib/WEngineStats";
import { OptimizerReport } from "@/components/character-optimizer-page/optimizerReport";
import { DiskWheelProps } from "@/components/character-optimizer-page/diskWheel";
import { AgentStats } from "@/lib/agentStats";
export interface PartitionSetting {
  id: string;
  groupID?: string;
  label: string;
  enabled: boolean;
}

interface StatRowData {
  min: number | null; //when null, we don't care about this stat (no min or max, will trigger a warning)
  max: number | null;
  rank: number | null; //when null, treat as lowest priority to optimize for, trigger a warning
}

export interface Agent {
  agentStats: AgentStats;
  agentLevel: number;
  agentMaxLevel: number;
}

export const OPTIMIZER_STATS = [
  "ATK",
  "HP",
  "DEF",
  "CRIT Rate",
  "CRIT DMG",
  "ER",
  "AP",
  "AM",
  "PEN",
] as const;

export interface StatGoalsData {
  ATK: StatRowData;
  HP: StatRowData;
  DEF: StatRowData;
  "CRIT Rate": StatRowData;
  "CRIT DMG": StatRowData;
  ER: StatRowData;
  AP: StatRowData;
  AM: StatRowData;
  PEN: StatRowData;
}

interface OptimizerContextType {
  // Disk Wheel State
  selectedWEngine: WEngineStats | null;
  setSelectedWEngine: (wengine: WEngineStats | null) => void;
  selectedDisk: DiskScan | null;
  setSelectedDisk: (disk: DiskScan | null) => void;

  //Disk Plating Reccomendations State
  diskPlatingReccomendations: DiskScan[] | null;
  setDiskPlatingReccomendations: (reccomendations: DiskScan[] | null) => void;

  // Disk Setup State
  selectedSets: (DiskDriveSet | undefined)[];
  setSelectedSets: (sets: (DiskDriveSet | undefined)[]) => void;

  //Optimizer Report State
  optimizerReport: OptimizerReport;
  setOptimizerReport: (report: OptimizerReport) => void;

  // Stat Goals State
  statGoals: StatGoalsData;
  setStatGoals: (goals: StatGoalsData) => void;

  //Disk Wheel Result Disks
  diskWheelResultDisks: DiskWheelProps;
  setDiskWheelResultDisks: (disks: DiskWheelProps) => void;

  // Disk Wheel Config State
  partitionSettings: Record<number, PartitionSetting[]>;
  updatePartitionSetting: (
    partitionNumber: number,
    settingId: string,
    enabled: boolean,
  ) => void;

  // Selected Agent State
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
}

const OptimizerContext = createContext<OptimizerContextType | undefined>(
  undefined,
);

export function OptimizerProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  // Initialize state here
  const [selectedWEngine, setSelectedWEngine] = useState<WEngineStats | null>(
    null,
  );
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedDisk, setSelectedDisk] = useState<DiskScan | null>(null);
  const [selectedSets, setSelectedSets] = useState<
    (DiskDriveSet | undefined)[]
  >([]);
  const [statGoals, setStatGoals] = useState<StatGoalsData>({
    ATK: { min: null, max: null, rank: null },
    HP: { min: null, max: null, rank: null },
    DEF: { min: null, max: null, rank: null },
    "CRIT Rate": { min: null, max: null, rank: null },
    "CRIT DMG": { min: null, max: null, rank: null },
    ER: { min: null, max: null, rank: null },
    AP: { min: null, max: null, rank: null },
    AM: { min: null, max: null, rank: null },
    PEN: { min: null, max: null, rank: null },
  });
  const [optimizerReport, setOptimizerReport] = useState<OptimizerReport>({
    errors: [],
    warnings: [],
  });
  const [diskPlatingReccomendations, setDiskPlatingReccomendations] = useState<
    DiskScan[] | null
  >(null);
  // const scanStore = useScanStore();
  // Initialize diskWheelResultDisks with test data
  //   const [diskWheelResultDisks, setDiskWheelResultDisks] =
  //     useState<DiskWheelProps>(() => {
  //       const testDisks: Array<{
  //         partition: 1 | 2 | 3 | 4 | 5 | 6;
  //         disk: DiskScan;
  //       }> = [];

  //       for (let partition = 1; partition <= 6; partition++) {
  //         const diskForPartition = scanStore.diskScans.find(
  //           (disk) => disk.partition_number === partition.toString(),
  //         );
  //         if (diskForPartition) {
  //           testDisks.push({
  //             partition: partition as 1 | 2 | 3 | 4 | 5 | 6,
  //             disk: diskForPartition,
  //           });
  //         }
  //       }

  //       return {
  //         disks:
  //           testDisks.length === 6
  //             ? (testDisks as DiskWheelProps["disks"])
  //             : undefined,
  //       };
  //     });

  const [diskWheelResultDisks, setDiskWheelResultDisks] =
    useState<DiskWheelProps>({});

  // Disk Wheel Config State
  const [partitionSettings, setPartitionSettings] = useState<
    Record<number, PartitionSetting[]>
  >({
    5: [
      {
        id: "partition5-force-elemental-dmg",
        groupID: "partition5-main-stats",
        label: "Force Elemental DMG%",
        enabled: false,
      },
      {
        id: "partition5-force-PEN-Ratio",
        groupID: "partition5-main-stats",
        label: "Force PEN Ratio",
        enabled: false,
      },
    ],
    6: [
      {
        id: "partition6-force-impact",
        groupID: "partition6-main-stats",
        label: "Force Impact",
        enabled: false,
      },
    ],
  });

  // Disk Wheel Config Handler - so that only one setting in a group can be enabled at a time
  const updatePartitionSetting = (
    partitionNumber: number,
    settingId: string,
    enabled: boolean,
  ) => {
    setPartitionSettings((prev) => {
      const newSettings = { ...prev };
      const partition = [...(newSettings[partitionNumber] || [])];

      // If enabling and there's a group ID, disable other settings in the same group
      const setting = partition.find((s) => s.id === settingId);
      if (setting && enabled && setting.groupID) {
        partition.forEach((s) => {
          if (s.groupID === setting.groupID) {
            s.enabled = s.id === settingId;
          }
        });
      } else {
        // Just toggle the specific setting
        const settingIndex = partition.findIndex((s) => s.id === settingId);
        if (settingIndex !== -1) {
          partition[settingIndex] = { ...partition[settingIndex], enabled };
        }
      }

      newSettings[partitionNumber] = partition;
      return newSettings;
    });
  };

  const value = useMemo(
    () => ({
      selectedWEngine,
      setSelectedWEngine,
      selectedDisk,
      setSelectedDisk,
      selectedSets,
      setSelectedSets,
      statGoals,
      setStatGoals,
      optimizerReport,
      setOptimizerReport,
      diskPlatingReccomendations,
      setDiskPlatingReccomendations,
      partitionSettings,
      updatePartitionSetting,
      diskWheelResultDisks,
      setDiskWheelResultDisks,
      selectedAgent,
      setSelectedAgent,
    }),
    [
      selectedWEngine,
      selectedDisk,
      selectedSets,
      statGoals,
      optimizerReport,
      diskPlatingReccomendations,
      partitionSettings,
      diskWheelResultDisks,
      selectedAgent,
    ],
  );

  return (
    <OptimizerContext.Provider value={value}>
      {children}
    </OptimizerContext.Provider>
  );
}

export function useOptimizer() {
  const context = useContext(OptimizerContext);
  if (context === undefined) {
    throw new Error("useOptimizer must be used within an OptimizerProvider");
  }
  return context;
}
