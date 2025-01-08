"use client";

import { useScanStore } from "@/atomsAndStores/useScanStore";
import CharacterReel from "@/components/character-optimizer-page/CharacterReel";
import { useRouter } from "next/navigation";

export default function CharacterOptimizer() {
  const hasLocalData = useScanStore((state) => state.hasLocalData());
  const router = useRouter();
  //if we don't have local data, we need to redirect to the landing page
  if (!hasLocalData) {
    router.push("/");
  }

  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-4 py-8 text-white md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <span className="text-center font-DOS text-4xl">
          Character Optimizer
        </span>
      </div>
      <CharacterReel forwardOnly={false} />
    </section>
  );
}
