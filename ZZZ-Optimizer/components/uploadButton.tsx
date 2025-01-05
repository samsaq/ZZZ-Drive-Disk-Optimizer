"use client";

import { useScanStore } from "@/atomsAndStores/useScanStore";
import { getSession } from "next-auth/react";
import { ShinyButton } from "@/components/shinyButton";

export const UploadButton = () => {
  const { setScans, diskScans } = useScanStore();

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

  return (
    <>
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
        text="Upload Drive Disk Data"
        textClasses="text-2xl font-DOS"
        onClick={() => {
          document.getElementById("fileInput")?.click();
        }}
      />
    </>
  );
};
