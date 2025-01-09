"use client";

import { pageTitle } from "@/atomsAndStores/atoms";
import { useScanStore } from "@/atomsAndStores/useScanStore";
import CharacterReel from "@/components/character-optimizer-page/CharacterReel";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import StatBoundRow from "@/components/character-optimizer-page/statBoundRow";
import { DiskViewWindow } from "@/components/character-optimizer-page/diskViewWindow";
import { WEngineViewWindow } from "@/components/character-optimizer-page/wengineViewWindow";
import { WEngines } from "@/lib/WEngineStats";
import { useState, useRef } from "react";

export default function CharacterOptimizer() {
  const hasLocalData = useScanStore((state) => state.hasLocalData());
  const [, setPageTitle] = useAtom(pageTitle);
  const router = useRouter();
  setPageTitle("Character Optimizer");
  //if we don't have local data, we need to redirect to the landing page
  if (!hasLocalData) {
    router.push("/");
  }

  const [isDiskViewOpen, setIsDiskViewOpen] = useState(false);
  const [isWEngineViewOpen, setIsWEngineViewOpen] = useState(false);
  const diskViewButtonRef = useRef<HTMLButtonElement>(null);
  const wengineViewButtonRef = useRef<HTMLButtonElement>(null);
  const diskScans = useScanStore((state) => state.diskScans);

  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-4 py-8 text-white md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <span className="text-center font-DOS text-4xl">
          <StatBoundRow
            statName="ATK"
            defaultMin={0}
            defaultMax={100}
            defaultRank={1}
          />
          <div className="flex justify-center gap-4">
            <button
              className="my-4 border-2 border-white p-1 font-DOS"
              onClick={() => setIsDiskViewOpen(true)}
              ref={diskViewButtonRef}
            >
              View Disk
            </button>
            <button
              className="my-4 border-2 border-white p-1 font-DOS"
              onClick={() => setIsWEngineViewOpen(true)}
              ref={wengineViewButtonRef}
            >
              View WEngine
            </button>
          </div>

          {isDiskViewOpen && diskScans.length > 0 && (
            <DiskViewWindow
              id="diskViewWindow"
              isOpen={isDiskViewOpen}
              onClose={() => setIsDiskViewOpen(false)}
              disk={diskScans[0]}
              position={{
                targetRef: diskViewButtonRef,
                direction: "bottom",
                anchor: "center",
                offset: 10,
              }}
            />
          )}

          {isWEngineViewOpen && WEngines.length > 0 && (
            <WEngineViewWindow
              id="wengineViewWindow"
              isOpen={isWEngineViewOpen}
              onClose={() => setIsWEngineViewOpen(false)}
              wengine={WEngines[0]}
              position={{
                targetRef: wengineViewButtonRef,
                direction: "bottom",
                anchor: "center",
                offset: 10,
              }}
            />
          )}
        </span>
        <CharacterReel forwardOnly={true} useImageTabs={true} />
      </div>
    </section>
  );
}
