// a component that overlays the screen with a CRT monitor shell mask around the edge of the screen
// use the crt_amber_mask.png image as the mask
import Image from "next/image";

import CRTStyles from "@/styles/crt.module.css";

export default function CRTOverlay() {
  return (
    <>
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden z-50`}
      >
        <Image fill alt="CRT Monitor Mask" src="/crt_amber_mask.png" />
      </div>
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden ${CRTStyles.crt}`}
      />
    </>
  );
}
