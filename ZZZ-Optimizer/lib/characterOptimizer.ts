//code to optimize character for given stat goals, accounting for disk constraints, chosen wengine, and disk setup
//will also generate a sorted list of unplated (unleveled) disks that are ideal to level up for these goals
//used by the optimize button using the optimizerContext's data

import { WEngineStats } from "./WEngineStats";
import { DiskDriveSet } from "./diskStats";
import { DiskScan } from "./utils";
import { DiskWheelProps } from "@/components/character-optimizer-page/diskWheel";
import {
  PartitionSetting,
  StatGoalsData,
} from "@/components/character-optimizer-page/optimizerContext";
import { OptimizerReport } from "@/components/character-optimizer-page/optimizerReport";
import { useScanStore } from "@/atomsAndStores/useScanStore";
import { Agent } from "@/components/character-optimizer-page/optimizerContext";

interface CharacterOptimizerResult {
  diskWheelResultDisks: DiskWheelProps;
  diskPlatingReccomendations: DiskScan[];
  report: OptimizerReport;
}

export function characterOptimize(
  statGoals: StatGoalsData,
  diskConstraints: Record<number, PartitionSetting[]>,
  wengine: WEngineStats,
  agent: Agent,
  diskSetup: (DiskDriveSet | undefined)[],
): CharacterOptimizerResult {
  const diskScans = useScanStore.getState().diskScans;

  //grab the constraints of interest from the diskConstraints
  //at present, these are the the restriction to impact on partition 6, elemental DMG % on 5, and PEN Ratio on 5
  //We'll add more constraints if needed later

  const partition6ImpactConstraint = !!diskConstraints[6].find(
    (constraint) => constraint.id === "partition6-force-impact",
  );
  const partition5ElementalDmgConstraint = !!diskConstraints[5].find(
    (constraint) => constraint.id === "partition5-force-elemental-dmg",
  );
  const partition5PENRatioConstraint = !!diskConstraints[5].find(
    (constraint) => constraint.id === "partition5-force-PEN-Ratio",
  );

  //filter the diskScans to a subset for optimization with the constraints accounted for
  let diskScansConstrained = diskScans.filter((disk) => {
    // Partition 6 Impact constraint
    if (partition6ImpactConstraint && disk.partition_number === "6") {
      return disk.drive_base_stat === "Impact";
    }

    // Partition 5 constraints
    if (disk.partition_number === "5") {
      if (partition5ElementalDmgConstraint) {
        // Check if disk's elemental DMG matches agent's element
        return disk.drive_base_stat.includes(agent.element);
      }
      if (partition5PENRatioConstraint) {
        return disk.drive_base_stat === "PEN Ratio";
      }
    }

    return true;
  });

  //if diskSetup is not undefined, filter the diskScans to only include disks that are in the diskSetup
}
