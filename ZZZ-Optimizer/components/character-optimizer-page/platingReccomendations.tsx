import { UpgradeDiskViewWindow } from "@/components/OSWindow-Variants/upgradeDiskViewWindow";
import type { DiskScan } from "@/lib/utils";
import { useRef, useState } from "react";

export interface PlatingReccomendationsProps {
  upgradeDisks: DiskScan[];
}

export const PlatingReccomendations = ({
  upgradeDisks,
}: PlatingReccomendationsProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-0">
      <span
        ref={textRef}
        className="cursor-pointer text-base text-blue-400 underline decoration-dotted underline-offset-4"
        onClick={() => setIsOpen(true)}
      >
        Plating Reccomendations
      </span>
      <UpgradeDiskViewWindow
        id="upgrade-disk-view"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        disks={upgradeDisks}
        position={{
          targetRef: textRef,
          direction: "top",
          anchor: "center",
          offset: 20,
        }}
      />
    </div>
  );
};
