import { useState, useRef } from "react";
import { SetSelectorWindow } from "../OSWindow-Variants/setSelectorWindow";
import { SetDisplaySlot } from "./setDisplaySlot";
import { DiskDriveSet } from "@/lib/diskStats";
import { cn } from "@/lib/utils";

type SetupType = "4p2p" | "2p2p2p" | "none";

export default function DiskSetupSelector() {
  const [setupType, setSetupType] = useState<SetupType>("none");
  const [selectedSets, setSelectedSets] = useState<
    (DiskDriveSet | undefined)[]
  >([]);
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

  const openSetSelector = (index: number) => {
    setCurrentEditingIndex(index);
    setIsSetSelectorOpen(true);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Title */}
      <h2 className="font-DOS text-lg text-white">Disk Setup</h2>

      {/* Setup Type Buttons - changed from flex-row to flex-col */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            setSetupType(setupType === "4p2p" ? "none" : "4p2p");
            setSelectedSets(
              setupType === "4p2p" ? [] : new Array(2).fill(undefined),
            );
          }}
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
          onClick={() => {
            setSetupType(setupType === "2p2p2p" ? "none" : "2p2p2p");
            setSelectedSets(
              setupType === "2p2p2p" ? [] : new Array(3).fill(undefined),
            );
          }}
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

        {/* Moved slots into the same container and removed max-width */}
        {setupType !== "none" && (
          <div className="flex max-w-[150px] flex-col gap-0">
            {selectedSets.map((set, index) => (
              <SetDisplaySlot
                key={`${setupType}-slot-${index}`}
                set={set}
                onClick={() => openSetSelector(index)}
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
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }}
      />
    </div>
  );
}
