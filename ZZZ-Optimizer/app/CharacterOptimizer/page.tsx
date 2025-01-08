"use client";

import { pageTitle } from "@/atomsAndStores/atoms";
import { useScanStore } from "@/atomsAndStores/useScanStore";
import CharacterReel from "@/components/character-optimizer-page/CharacterReel";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import StatBoundRow from "@/components/character-optimizer-page/statBoundRow";

export default function CharacterOptimizer() {
  const hasLocalData = useScanStore((state) => state.hasLocalData());
  const [, setPageTitle] = useAtom(pageTitle);
  const router = useRouter();
  setPageTitle("Character Optimizer");
  //if we don't have local data, we need to redirect to the landing page
  if (!hasLocalData) {
    router.push("/");
  }

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
        </span>
      </div>
      <CharacterReel forwardOnly={true} useImageTabs={true} />
    </section>
  );
}
