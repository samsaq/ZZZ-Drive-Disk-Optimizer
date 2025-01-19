"use client";

import { useScanStore } from "@/atomsAndStores/useScanStore";
import { TerminalOutput } from "../terminalOutput";

export function ScanDataTerminalOutput() {
  const lastUploadTime = useScanStore((state) => state.lastUploadTime);
  let displayString = "...";
  let displayColor = "text-white";

  if (lastUploadTime != null || lastUploadTime != undefined) {
    displayString = new Date(lastUploadTime).toLocaleString("en-US", {
      month: "2-digit",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    displayString = ` Last Upload: ${displayString}`;
  }

  return (
    <TerminalOutput
      className={`fixed bottom-[4vh] left-[4vw]`}
      inputClassName={`${displayColor}`}
      textSize="text-3xl"
      text={displayString}
    />
  );
}
