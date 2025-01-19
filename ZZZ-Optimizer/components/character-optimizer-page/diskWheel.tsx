import { useState, useRef, useEffect } from "react";
import { WEngineSearchSelectWindow } from "@/components/OSWindow-Variants/wengineSeachSelectWindow";
import { WEngineStats } from "@/lib/WEngineStats";
import { DiskScan } from "@/lib/utils";
import { DiskViewWindow } from "@/components/OSWindow-Variants/diskViewWindow";
import { Icon } from "@iconify/react";
import { DiskWheelConfigWindow } from "./diskWheelConfigWindow";
import { useOptimizer } from "@/components/character-optimizer-page/optimizerContext";
import { OptimizerReportViewWindow } from "@/components/OSWindow-Variants/optimizerReportViewWindow";

export interface DiskWheelProps {
  disks?: [
    { partition: 1; disk: DiskScan },
    { partition: 2; disk: DiskScan },
    { partition: 3; disk: DiskScan },
    { partition: 4; disk: DiskScan },
    { partition: 5; disk: DiskScan },
    { partition: 6; disk: DiskScan },
  ];
}

export const DiskWheel: React.FC<DiskWheelProps> = () => {
  const { diskWheelResultDisks } = useOptimizer();
  const disks = diskWheelResultDisks.disks;

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
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const configButtonRef = useRef<HTMLButtonElement>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const reportButtonRef = useRef<HTMLButtonElement>(null);
  const { optimizerReport, partitionSettings } = useOptimizer();
  const { errors, warnings } = optimizerReport;
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

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

  const wengineSelectButtonRef = useRef<HTMLButtonElement>(null);

  const getPositionClasses = (partition: 1 | 2 | 3 | 4 | 5 | 6) => {
    const baseClasses =
      "absolute left-[50%] top-[50%] w-[80px] h-[80px] object-contain";
    const positions: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
      1: "-translate-x-[153%] -translate-y-[193%]",
      2: "-translate-x-[220%] -translate-y-1/2",
      3: "-translate-x-[153%] translate-y-[94%]",
      4: "translate-x-[54%] translate-y-[94%]",
      5: "translate-x-[122%] -translate-y-1/2",
      6: "translate-x-[53%] -translate-y-[193%]",
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
      <button
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
      </button>
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
            offset: 150,
            direction: "right",
            anchor: "center",
          }}
        />
      )}
      <DiskWheelConfigWindow
        id="disk-wheel-config"
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        position={{
          targetRef: configButtonRef,
          direction: "right",
          anchor: "center",
          offset: 10,
        }}
        partitions={Object.entries(partitionSettings).map(
          ([partitionNumber, settings]) => ({
            partitionNumber: parseInt(partitionNumber),
            settings,
          }),
        )}
      />
      <OptimizerReportViewWindow
        id="optimizer-report"
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={optimizerReport}
        position={{
          targetRef: reportButtonRef,
          direction: "right",
          anchor: "center",
          offset: 10,
        }}
      />
      <div className="relative flex h-fit w-fit items-center justify-center brightness-125">
        <button
          ref={reportButtonRef}
          className="absolute left-0 top-0 z-10 cursor-pointer p-2"
          onClick={() => setIsReportOpen(true)}
        >
          <div className="flex flex-col items-center">
            <Icon
              icon="ant-design:warning-outlined"
              className="h-8 w-8"
              color={hasWarnings ? "#f97316" : "white"}
            />
            <span
              className="text-base"
              style={{ color: hasWarnings ? "#f97316" : "white" }}
            >
              {hasWarnings ? warnings.length : 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Icon
              icon="codicon:error"
              className="h-8 w-8"
              color={hasErrors ? "#ef4444" : "white"}
            />
            <span
              className="text-base"
              style={{ color: hasErrors ? "#ef4444" : "white" }}
            >
              {hasErrors ? errors.length : 0}
            </span>
          </div>
        </button>

        <button
          ref={configButtonRef}
          className="absolute right-0 top-0 z-10 cursor-pointer p-2"
          onClick={() => setIsConfigOpen(true)}
        >
          <Icon
            icon="mdi:gear"
            className="motion-preset-spin h-10 w-10 text-white/80 motion-duration-[8000ms]"
          />
        </button>

        <img
          src={diskWheelImagePath}
          alt="Disk Wheel"
          className="pointer-events-none w-[400px] object-contain"
        />

        <button
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
        </button>

        {/* Render all disks */}
        {disks?.map((diskData, index) => renderDiskButton(diskData))}
      </div>
    </>
  );
};
