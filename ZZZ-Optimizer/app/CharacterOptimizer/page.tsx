"use client";

import { pageTitle } from "@/atomsAndStores/atoms";
import { useScanStore } from "@/atomsAndStores/useScanStore";
import CharacterReel from "@/components/character-optimizer-page/CharacterReel";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { DiskWheel } from "@/components/character-optimizer-page/diskWheel";
import { PlatingReccomendations } from "@/components/character-optimizer-page/platingReccomendations";
import { StatGoals } from "@/components/character-optimizer-page/statGoals";
import { ShinyButton } from "@/components/shinyButton";
import DiskSetupSelector from "@/components/character-optimizer-page/diskSetupSelector";
import { OptimizerProvider } from "@/components/character-optimizer-page/optimizerContext";
export default function CharacterOptimizer() {
  const hasLocalData = useScanStore((state) => state.hasLocalData());
  const [, setPageTitle] = useAtom(pageTitle);
  const router = useRouter();
  setPageTitle("Character Optimizer");
  //if we don't have local data, we need to redirect to the landing page
  // if (!hasLocalData) {
  //   router.push("/");
  // }

  return (
    <OptimizerProvider>
      <section className="flex h-full w-full flex-col items-center justify-center gap-4 py-8 text-white md:py-10">
        <div className="w-fit">
          <div className="relative flex w-fit flex-row font-DOS">
            <div className="flex flex-col items-center justify-center gap-0">
              <div className="relative">
                <DiskWheel />
                <div className="relative pt-4">
                  <PlatingReccomendations />
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
    </OptimizerProvider>
  );
}
