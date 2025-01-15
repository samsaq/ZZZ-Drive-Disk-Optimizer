import { useState, useRef, useEffect } from "react";
import { WEngineSearchSelectWindow } from "../OSWindow-Variants/wengineSeachSelectWindow";
import { WEngineStats } from "@/lib/WEngineStats";

export interface DiskWheelProps {
  leftDisks?: { position: "top" | "middle" | "bottom"; imagePath: string }[];
  rightDisks?: { position: "top" | "middle" | "bottom"; imagePath: string }[];
}

export const DiskWheel: React.FC<DiskWheelProps> = ({
  leftDisks = [],
  rightDisks = [],
}) => {
  const diskWheelImagePath =
    "/ZZZ-Disk-Drive-Images/disk_holder_no_bg_wengine_hole.png";

  const [isWEngineWindowOpen, setIsWEngineWindowOpen] = useState(false);
  const [selectedWEngine, setSelectedWEngine] = useState<WEngineStats | null>(
    null,
  );

  const [wengineImagePath, setWengineImagePath] = useState<string>(
    "/ZZZ-WEngine-Images/No_WEngine_Selected.png",
  );

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

  const getPositionClasses = (
    side: "left" | "right",
    position: "top" | "middle" | "bottom",
  ) => {
    const baseClasses =
      "absolute left-[50%] top-[50%] w-[64px] h-[64px] object-contain";
    const positions = {
      left: {
        top: "-translate-x-[200%] -translate-y-[200%]",
        middle: "-translate-x-[250%] -translate-y-1/2",
        bottom: "-translate-x-[200%] translate-y-[100%]",
      },
      right: {
        top: "translate-x-[100%] -translate-y-[200%]",
        middle: "translate-x-[150%] -translate-y-1/2",
        bottom: "translate-x-[100%] translate-y-[100%]",
      },
    };
    return `${baseClasses} ${positions[side][position]}`;
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

        {/* Left side disks */}
        {leftDisks.map((disk, index) => (
          <img
            key={`left-${disk.position}-${index}`}
            src={disk.imagePath}
            alt={`Left ${disk.position} disk`}
            className={getPositionClasses("left", disk.position)}
          />
        ))}

        {/* Right side disks */}
        {rightDisks.map((disk, index) => (
          <img
            key={`right-${disk.position}-${index}`}
            src={disk.imagePath}
            alt={`Right ${disk.position} disk`}
            className={getPositionClasses("right", disk.position)}
          />
        ))}
      </div>
    </>
  );
};
