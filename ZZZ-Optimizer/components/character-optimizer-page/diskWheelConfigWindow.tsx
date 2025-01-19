"use client";

import React from "react";
import { OSWindow } from "@/components/OSWindow";
import { Switch } from "@/components/switch";
import { useOptimizer } from "@/components/character-optimizer-page/optimizerContext";

interface PartitionSetting {
  id: string;
  groupID?: string; //if settings are grouped, only one setting in a group can be enabled at a time
  label: string;
  enabled: boolean;
}

interface PartitionConfig {
  partitionNumber: number;
  settings: PartitionSetting[];
}

interface DiskWheelConfigWindowProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  position: {
    targetRef: React.RefObject<HTMLElement>;
    direction: "top" | "right" | "bottom" | "left";
    anchor: "start" | "center" | "end";
    offset?: number;
  };
  partitions: PartitionConfig[];
}

export function DiskWheelConfigWindow({
  id,
  isOpen,
  onClose,
  position,
  partitions,
}: Readonly<DiskWheelConfigWindowProps>) {
  const { updatePartitionSetting } = useOptimizer();

  return (
    <OSWindow
      id={id}
      title="Disk Constraints"
      isOpen={isOpen}
      onClose={onClose}
      position={position}
      className="min-w-[300px]"
    >
      <div className="flex flex-col gap-4">
        {/* Group settings by partition number */}
        {Object.entries(
          partitions.reduce(
            (acc, partition) => {
              if (partition.settings.length > 0) {
                if (!acc[partition.partitionNumber]) {
                  acc[partition.partitionNumber] = [];
                }
                acc[partition.partitionNumber].push(...partition.settings);
              }
              return acc;
            },
            {} as Record<number, PartitionSetting[]>,
          ),
        ).map(([partitionNumber, settings]) => (
          <div key={partitionNumber} className="flex flex-col gap-2">
            <h2 className="font-DOS text-lg">Partition {partitionNumber}</h2>
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between space-x-4"
              >
                <span className="font-DOS text-base">{setting.label}</span>
                <Switch
                  id={setting.id}
                  checked={setting.enabled}
                  onCheckedChange={(newValue) =>
                    updatePartitionSetting(
                      Number(partitionNumber),
                      setting.id,
                      newValue,
                    )
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </OSWindow>
  );
}
