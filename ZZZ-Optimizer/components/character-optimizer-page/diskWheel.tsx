import { useState, useRef, useEffect } from "react";
import { WEngineSearchSelectWindow } from "@/components/OSWindow-Variants/wengineSeachSelectWindow";
import { WEngineStats } from "@/lib/WEngineStats";
import { DiskScan } from "@/lib/utils";
import { DiskViewWindow } from "@/components/OSWindow-Variants/diskViewWindow";

export interface DiskWheelProps {
  disks?: { partition: 1 | 2 | 3 | 4 | 5 | 6; disk: DiskScan }[];
}

export const DiskWheel: React.FC<DiskWheelProps> = ({ disks = [] }) => {
  const diskWheelImagePath =
    "/ZZZ-Disk-Drive-Images/disk_holder_no_bg_wengine_hole.png";

  const [isWEngineWindowOpen, setIsWEngineWindowOpen] = useState(false);
  const [selectedWEngine, setSelectedWEngine] = useState<WEngineStats | null>(
    null,
  );

  const [wengineImagePath, setWengineImagePath] = useState<string>(
    "/ZZZ-WEngine-Images/No_WEngine_Selected.png",
  );

  const [selectedDisk, setSelectedDisk] = useState<DiskScan | null>(null);
  const [isDiskViewOpen, setIsDiskViewOpen] = useState(false);

  //on select wengine, set the wengine image path
  const handleWEngineSelect = (wengine: WEngineStats) => {
    setSelectedWEngine(wengine);
    const wengineName =
      wengine.name.replace(/\[([^\]]+)\]/g, "($1)").replace(/\s+/g, "_") +
      "_" +
      wengine.rank;
    const wengineImage = `/ZZZ-WEngine-Images/${wengine.type}/${wengineName}.png`;
    setWengineImagePath(wengineImage);
  };
  useEffect(() => {
    if (selectedWEngine) {
      handleWEngineSelect(selectedWEngine);
    }
  }, [selectedWEngine]);

  const wengineSelectButtonRef = useRef<HTMLDivElement>(null);

  const getPositionClasses = (partition: 1 | 2 | 3 | 4 | 5 | 6) => {
    const baseClasses =
      "absolute left-[50%] top-[50%] w-[80px] h-[80px] object-contain";
    const positions: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
      1: "-translate-x-[153%] -translate-y-[195%]",
      2: "-translate-x-[250%] -translate-y-1/2",
      3: "-translate-x-[153%] translate-y-[94%]",
      4: "translate-x-[54%] translate-y-[94%]",
      5: "translate-x-[122%] -translate-y-1/2",
      6: "translate-x-[54%] -translate-y-[195%]",
    };
    return `${baseClasses} ${positions[partition]}`;
  };

  const renderDiskButton = (diskData: {
    partition: 1 | 2 | 3 | 4 | 5 | 6;
    disk: DiskScan;
  }) => {
    if (!diskData) return null;
    const { disk, partition } = diskData;
    const setName = disk.set_name.replace(/ /g, "_");
    const imagePath = `/ZZZ-Disk-Drive-Images/Disk_Images/${setName}.png`;

    return (
      <div
        className={getPositionClasses(partition)}
        onClick={() => {
          setSelectedDisk(disk);
          setIsDiskViewOpen(true);
        }}
      >
        <div className="group relative h-full w-full">
          <div className="absolute inset-0 rounded-full border-4 border-transparent transition-colors group-hover:border-white/70" />
          <img
            src={imagePath}
            alt={`Partition ${partition} disk`}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <WEngineSearchSelectWindow
        id="wengine-select"
        isOpen={isWEngineWindowOpen}
        onClose={() => setIsWEngineWindowOpen(false)}
        position={{
          targetRef: wengineSelectButtonRef,
          offset: 20,
          direction: "right",
          anchor: "center",
        }}
        onSelect={setSelectedWEngine}
      />
      {selectedDisk && (
        <DiskViewWindow
          id="disk-view"
          isOpen={isDiskViewOpen}
          onClose={() => setIsDiskViewOpen(false)}
          disk={selectedDisk}
          position={{
            targetRef: wengineSelectButtonRef,
            offset: 20,
            direction: "right",
            anchor: "center",
          }}
        />
      )}
      <div className="relative flex h-fit w-fit items-center justify-center brightness-125">
        <img
          src={diskWheelImagePath}
          alt="Disk Wheel"
          className="pointer-events-none w-[400px] object-contain"
        />

        <div
          className="absolute cursor-pointer"
          onClick={() => setIsWEngineWindowOpen(true)}
          ref={wengineSelectButtonRef}
        >
          <div className="group relative flex h-[128px] w-[128px] items-center justify-center">
            <div
              className="absolute rounded-full border-4 border-transparent transition-colors group-hover:border-white/70"
              style={{
                content: '""',
                width: "132px",
                height: "132px",
              }}
            />
            <img
              src={wengineImagePath}
              alt="Wengine"
              className="relative z-10 h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Render all disks */}
        {disks.map((diskData, index) => renderDiskButton(diskData))}
      </div>
    </>
  );
};
