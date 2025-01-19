import { useState, useRef } from "react";
import { SetSelectorWindow } from "../OSWindow-Variants/setSelectorWindow";
import { SetDisplaySlot } from "./setDisplaySlot";
import { DiskDriveSet } from "@/lib/diskStats";
import { cn } from "@/lib/utils";
import { useOptimizer } from "@/components/character-optimizer-page/optimizerContext";

type SetupType = "4p2p" | "2p2p2p" | "none";

export default function DiskSetupSelector() {
  // Get context values and setters
  const { selectedSets, setSelectedSets } = useOptimizer();

  // Local state for UI management
  const [setupType, setSetupType] = useState<SetupType>("none");
  const [isSetSelectorOpen, setIsSetSelectorOpen] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(-1);
  const setSelectorRef = useRef<HTMLButtonElement>(null);

  const handleSetSelect = (set: DiskDriveSet) => {
    if (currentEditingIndex !== -1) {
      const newSets = [...selectedSets];
      newSets[currentEditingIndex] = set;
      setSelectedSets(newSets);
    }
    setIsSetSelectorOpen(false);
  };

  const handleSetupTypeChange = (newType: SetupType) => {
    const isResetting = setupType === newType;
    setSetupType(isResetting ? "none" : newType);

    // Update the context with new array of empty sets or clear it
    const newSetCount = newType === "4p2p" ? 2 : 3;
    setSelectedSets(isResetting ? [] : new Array(newSetCount).fill(undefined));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Title */}
      <h2 className="font-DOS text-lg text-white">Disk Setup</h2>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleSetupTypeChange("4p2p")}
          className={cn(
            "text-nowrap border border-gray-300 p-2 font-DOS text-base",
            setupType === "4p2p"
              ? "bg-white text-black"
              : "bg-black text-white",
          )}
        >
          4p + 2p
        </button>
        <button
          onClick={() => handleSetupTypeChange("2p2p2p")}
          className={cn(
            "text-nowrap border border-gray-300 p-2 font-DOS text-base",
            setupType === "2p2p2p"
              ? "bg-white text-black"
              : "bg-black text-white",
          )}
          ref={setSelectorRef}
        >
          2p + 2p + 2p
        </button>

        {setupType !== "none" && (
          <div className="flex max-w-[150px] flex-col gap-0">
            {selectedSets.map((set, index) => (
              <SetDisplaySlot
                key={`${setupType}-slot-${index}`}
                set={set}
                onClick={() => {
                  setCurrentEditingIndex(index);
                  setIsSetSelectorOpen(true);
                }}
                position={{
                  isFirst: index === 0,
                  isLast: index === selectedSets.length - 1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Set Selector Window */}
      <SetSelectorWindow
        id={`disk-set-selector-${currentEditingIndex}`}
        isOpen={isSetSelectorOpen}
        onClose={() => setIsSetSelectorOpen(false)}
        onSetSelect={handleSetSelect}
        position={{
          targetRef: setSelectorRef,
          direction: "left",
          anchor: "center",
          offset: 20,
        }}
      />
    </div>
  );
}
