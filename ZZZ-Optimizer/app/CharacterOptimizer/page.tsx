"use client";

import { pageTitle } from "@/atomsAndStores/atoms";
import { useScanStore } from "@/atomsAndStores/useScanStore";
import CharacterReel from "@/components/character-optimizer-page/CharacterReel";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { OptimizerReport } from "@/components/character-optimizer-page/optimizerReport";
import { DiskWheel } from "@/components/character-optimizer-page/diskWheel";
import { PlatingReccomendations } from "@/components/character-optimizer-page/platingReccomendations";
import { StatGoals } from "@/components/character-optimizer-page/statGoals";
import { ShinyButton } from "@/components/shinyButton";
import DiskSetupSelector from "@/components/character-optimizer-page/diskSetupSelector";
import type { DiskWheelProps } from "@/components/character-optimizer-page/diskWheel";
export default function CharacterOptimizer() {
  const hasLocalData = useScanStore((state) => state.hasLocalData());
  const [, setPageTitle] = useAtom(pageTitle);
  const router = useRouter();
  setPageTitle("Character Optimizer");
  //if we don't have local data, we need to redirect to the landing page
  if (!hasLocalData) {
    router.push("/");
  }

  const optimizerReport = {
    errors: [],
    warnings: [],
  };

  //grab some disks from the scan store for testing the plating reccomendations
  const diskScans = useScanStore((state) => state.diskScans);
  const upgradeDisks = [...diskScans] // Create explicit copy using spread operator
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  //Grab one disk from each partition for the disk wheel
  const disksOnePerPartition = Object.values(
    diskScans.reduce(
      (acc, disk) => {
        if (!acc[disk.partition_number]) {
          acc[disk.partition_number] = {
            partition: Number(disk.partition_number) as 1 | 2 | 3 | 4 | 5 | 6,
            disk: disk,
          };
        }
        return acc;
      },
      {} as Record<
        number,
        { partition: 1 | 2 | 3 | 4 | 5 | 6; disk: (typeof diskScans)[0] }
      >,
    ),
  );

  const diskWheelProps: DiskWheelProps = {
    disks: Object.values(disksOnePerPartition),
  };

  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-4 py-8 text-white md:py-10">
      <div className="w-fit">
        <div className="relative flex w-fit flex-row font-DOS">
          <div className="pt-4" style={{ left: "1rem" }}>
            <OptimizerReport report={optimizerReport} />
          </div>
          <div className="flex flex-col items-center justify-center gap-0">
            <div className="relative">
              <DiskWheel {...diskWheelProps} />
              <div className="relative pt-4">
                <PlatingReccomendations upgradeDisks={upgradeDisks} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start">
            <div className="flex flex-col items-center pb-4">
              <span className="pb-2 font-DOS text-lg text-white">
                Stat Goals
              </span>
              <StatGoals />
            </div>

            <ShinyButton text="Optimize Disks" textClasses="text-lg" />
          </div>
          <DiskSetupSelector />
        </div>
        <CharacterReel forwardOnly={true} useImageTabs={true} />
      </div>
    </section>
  );
}
