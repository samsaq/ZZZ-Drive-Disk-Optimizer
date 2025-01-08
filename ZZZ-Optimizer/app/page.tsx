"use client";

import { TextArt } from "@/components/textArt";
import { UploadButton } from "@/components/landing-page/uploadButton";
import { ScanDataTerminalOutput } from "@/components/landing-page/scanDataTerminalOutput";
import { useScanStore } from "@/atomsAndStores/useScanStore";

export default function Home() {
  const hasLocalData = useScanStore((state) => state.hasLocalData());
  const ZZZ =
    " ________  ________  ________     \n|\\_____  \\|\\_____  \\|\\_____  \\    \n \\|___/  /|\\|___/  /|\\|___/  /|   \n     /  / /    /  / /    /  / /   \n    /  /_/__  /  /_/__  /  /_/__  \n   |\\________\\\\________\\\\________\\\n    \\|_______|\\|_______|\\|_______|";

  return (
    <>
      <section className="flex h-full w-full flex-col items-center justify-center gap-4 py-8 text-white md:py-10">
        <div className="inline-block max-w-lg justify-center text-center">
          <TextArt className="text-xl" label="ZZZ" text={ZZZ} />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-center font-DOS text-4xl">Optimizer</span>
          <UploadButton />
        </div>
      </section>
      <ScanDataTerminalOutput />
    </>
  );
}
