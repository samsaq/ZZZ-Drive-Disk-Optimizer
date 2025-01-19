import { UpgradeDiskViewWindow } from "@/components/OSWindow-Variants/upgradeDiskViewWindow";
import type { DiskScan } from "@/lib/utils";
import { useRef, useState } from "react";
import { useOptimizer } from "@/components/character-optimizer-page/optimizerContext";

export const PlatingReccomendations = () => {
  const { diskPlatingReccomendations } = useOptimizer();
  const textRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-0">
      {diskPlatingReccomendations && (
        <button
          ref={textRef}
          className="cursor-pointer text-base text-blue-400 underline decoration-dotted underline-offset-4"
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
          tabIndex={0}
        >
          Plating Reccomendations
        </button>
      )}
      <UpgradeDiskViewWindow
        id="upgrade-disk-view"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        disks={diskPlatingReccomendations ?? []}
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
