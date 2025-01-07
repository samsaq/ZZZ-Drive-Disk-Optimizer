"use client";

import { useScanStore } from "@/atomsAndStores/useScanStore";

export default function CharacterOptimizer() {
  const hasLocalData = useScanStore((state) => state.hasLocalData());

  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-4 py-8 text-white md:py-10">
      <div className="inline-block max-w-lg justify-center text-center">
        <span className="text-center font-DOS text-4xl">
          Character Optimizer
        </span>
      </div>
    </section>
  );
}
