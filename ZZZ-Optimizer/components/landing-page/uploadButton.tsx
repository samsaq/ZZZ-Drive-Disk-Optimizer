"use client";

import { useScanStore } from "@/atomsAndStores/useScanStore";
import { getSession } from "next-auth/react";
import { ShinyButton } from "@/components/shinyButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { Icon } from "@iconify/react";

export const UploadButton = () => {
  const { setScans, diskScans } = useScanStore();
  const router = useRouter();
  const [buttonText, setButtonText] = useState("Upload Drive Disk Data");
  const [subtitleText, setSubtitleText] = useState(
    "Don't have a drive disk scan?",
  );
  const subtitleHref = siteConfig.links.scanner;
  const hasLocalData = useScanStore((state) => state.hasLocalData());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (hasLocalData) {
      setButtonText("Start Optimizing Disks");
      setSubtitleText("Upload a new drive disk scan");
    }
  }, [hasLocalData]);

  async function handleUpload(scanFile: File) {
    console.log("Uploading");
    const jsonData = JSON.parse(await scanFile.text());
    setScans(jsonData);

    //if the user is logged in, sync (upload) the data to the server
    const session = await getSession();
    if (session?.user) {
      const res = await fetch("/api/scans/upload", {
        method: "POST",
        body: JSON.stringify({ scans: diskScans }),
      });
      console.log("Upload response: ", res);
    }
  }

  if (!isMounted) {
    return <div className="flex flex-col items-center"></div>;
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept=".json"
        className="hidden"
        id="fileInput"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <ShinyButton
        text={buttonText}
        textClasses="text-2xl font-DOS"
        onClick={() => {
          if (!hasLocalData) {
            document.getElementById("fileInput")?.click();
          } else {
            router.push("/CharacterOptimizer");
          }
        }}
      />
      {!hasLocalData && (
        <a
          className="mt-1text-center font-DOS text-sm underline decoration-white decoration-dotted decoration-2 underline-offset-4"
          href={subtitleHref}
        >
          {subtitleText}
        </a>
      )}
      {hasLocalData && (
        <div className="mt-1 flex flex-row items-center justify-center gap-2">
          <div title="Download Scanner" className="cursor-pointer">
            <a href={siteConfig.links.scanner}>
              <Icon
                width={18}
                height={18}
                icon="memory:download"
                className="translate-y-[3px]"
              />
            </a>
          </div>
          <button
            className="text-center font-DOS text-sm underline decoration-white decoration-dotted decoration-2 underline-offset-4"
            onClick={() => {
              document.getElementById("fileInput")?.click();
            }}
          >
            {subtitleText}
          </button>
        </div>
      )}
    </div>
  );
};
