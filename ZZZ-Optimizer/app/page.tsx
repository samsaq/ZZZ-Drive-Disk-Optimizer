import { TextArt } from "@/components/textArt";
import { ShinyButton } from "@/components/shinyButton";
import { siteConfig } from "@/config/site";

export default function Home() {
  const ZZZ =
    " ________  ________  ________     \n|\\_____  \\|\\_____  \\|\\_____  \\    \n \\|___/  /|\\|___/  /|\\|___/  /|   \n     /  / /    /  / /    /  / /   \n    /  /_/__  /  /_/__  /  /_/__  \n   |\\________\\\\________\\\\________\\\n    \\|_______|\\|_______|\\|_______|";

  return (
    <section className=" h-full w-full flex flex-col items-center justify-center gap-4 py-8 md:py-10 text-white">
      <div className="inline-block max-w-lg text-center justify-center">
        <TextArt className="text-xl" label="ZZZ" text={ZZZ} />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-4xl font-DOS text-center">Optimizer</span>
        <ShinyButton
          text="Upload Drive Disk Data"
          textClasses="text-2xl font-DOS"
        />
        <a
          className="text-sm font-DOS text-center -mt-2 underline decoration-dotted decoration-white decoration-2 underline-offset-4"
          href={siteConfig.links.scanner}
        >
          Don&apos;t have a drive disk scan?
        </a>
      </div>
    </section>
  );
}
